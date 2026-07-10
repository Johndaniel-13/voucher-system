"""
FORGERY DETECTION — Checks if screenshot is AI-generated or genuine
====================================================================
Uses multiple techniques:
  1. EXIF/Metadata analysis — real screenshots have device info
  2. ELA (Error Level Analysis) — detects edited regions
  3. Noise pattern analysis — AI images have different noise profiles
  4. Compression artifact analysis

Each check returns a score. Combined score determines if genuine.
"""

import io
from PIL import Image, ImageChops, ImageStat
import statistics


def check_exif_metadata(image_bytes: bytes) -> dict:
    """
    Check if the image has EXIF metadata.
    Real screenshots from phones always have EXIF data (device, timestamp, etc.)
    AI-generated images usually have NO EXIF data.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        exif = image.getexif()

        has_exif = len(exif) > 0
        exif_keys = list(exif.keys()) if has_exif else []

        return {
            "has_metadata": has_exif,
            "metadata_count": len(exif_keys),
            "score": 100 if has_exif else 30,
            "detail": "EXIF metadata found" if has_exif else "No EXIF metadata — suspicious"
        }
    except Exception:
        return {"has_metadata": False, "metadata_count": 0, "score": 30, "detail": "Could not read metadata"}


def ela_analysis(image_bytes: bytes, quality: int = 90) -> dict:
    """
    Error Level Analysis — compress and compare.
    Edited/AI regions show different error levels than original regions.
    """
    try:
        original = Image.open(io.BytesIO(image_bytes))

        # Resave at lower quality
        buffer = io.BytesIO()
        original.save(buffer, format="JPEG", quality=quality)
        buffer.seek(0)
        compressed = Image.open(buffer)

        # Calculate difference
        diff = ImageChops.difference(original.convert("RGB"), compressed.convert("RGB"))
        stat = ImageStat.Stat(diff)

        # Higher average difference = more suspicious (AI or edited)
        avg_diff = sum(stat.mean) / len(stat.mean)

        # Score: low difference = genuine, high difference = suspicious
        if avg_diff < 5:
            score = 90
            detail = "Low ELA difference — likely genuine"
        elif avg_diff < 15:
            score = 60
            detail = "Moderate ELA difference — inconclusive"
        else:
            score = 30
            detail = "High ELA difference — potentially AI or edited"

        return {"average_difference": round(avg_diff, 2), "score": score, "detail": detail}

    except Exception as e:
        return {"average_difference": 0, "score": 50, "detail": f"ELA failed: {str(e)}"}


def noise_analysis(image_bytes: bytes) -> dict:
    """
    Analyze noise distribution.
    AI-generated images often have unnatural noise patterns
    (too uniform or completely absent).
    """
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("L")

        # Get pixel values
        pixels = list(image.getdata())

        # Calculate standard deviation of pixel values
        std_dev = statistics.stdev(pixels) if len(pixels) > 1 else 0

        # Real screenshots have natural noise variation
        if 30 < std_dev < 80:
            score = 85
            detail = f"Natural noise pattern (σ={std_dev:.1f})"
        elif std_dev <= 30:
            score = 35
            detail = f"Too smooth — possible AI generation (σ={std_dev:.1f})"
        else:
            score = 55
            detail = f"Unusual noise pattern (σ={std_dev:.1f})"

        return {"std_deviation": round(std_dev, 2), "score": score, "detail": detail}

    except Exception as e:
        return {"std_deviation": 0, "score": 50, "detail": f"Noise analysis failed: {str(e)}"}


def check_image_dimensions(image_bytes: bytes) -> dict:
    """
    Check if dimensions match real phone screenshots.
    AI images often have unusual aspect ratios or very high resolution.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        width, height = image.size
        aspect_ratio = width / height

        # Common phone screenshot aspect ratios
        common_ratios = {
            "9:16": 9/16,   # Most phones portrait
            "9:19.5": 9/19.5,  # iPhone X+
            "2:3": 2/3,     # Some Androids
        }

        # Check if ratio matches common phone ratios (within 5% tolerance)
        matches_phone = False
        closest = "unknown"
        for name, ratio in common_ratios.items():
            if abs(aspect_ratio - ratio) < 0.05:
                matches_phone = True
                closest = name
                break

        # Check resolution (real screenshots: 720p to 1440p range)
        is_realistic_res = (700 <= width <= 3000) and (1200 <= height <= 4000)

        score = 80 if (matches_phone and is_realistic_res) else 50 if is_realistic_res else 30
        detail = f"{width}x{height}, ratio {closest}" if matches_phone else f"{width}x{height}, unusual ratio"

        return {"width": width, "height": height, "matches_phone_ratio": matches_phone, "score": score, "detail": detail}

    except Exception as e:
        return {"score": 50, "detail": f"Dimension check failed: {str(e)}"}


def is_genuine_screenshot(image_bytes: bytes) -> dict:
    """
    Run ALL checks and return overall verdict.

    Returns:
        {
            "is_genuine": True/False,
            "confidence": 75.5,       # Overall confidence %
            "verdict": "Likely genuine",
            "individual_checks": { ... },  # All check results
            "flags": []                    # Any red flags found
        }
    """
    checks = {
        "exif": check_exif_metadata(image_bytes),
        "ela": ela_analysis(image_bytes),
        "noise": noise_analysis(image_bytes),
        "dimensions": check_image_dimensions(image_bytes),
    }

    # Weighted scoring
    weights = {
        "exif": 0.30,
        "ela": 0.25,
        "noise": 0.25,
        "dimensions": 0.20,
    }

    total_score = sum(checks[name]["score"] * weights[name] for name in checks)
    flags = [f"{name}: {checks[name]['detail']}" for name in checks if checks[name]["score"] < 50]

    # Determine verdict
    if total_score >= 70:
        verdict = "Genuine — high confidence"
        is_genuine = True
    elif total_score >= 50:
        verdict = "Likely genuine — moderate confidence"
        is_genuine = True
    elif total_score >= 35:
        verdict = "Suspicious — manual review recommended"
        is_genuine = False
    else:
        verdict = "Likely fake or AI-generated — rejected"
        is_genuine = False

    return {
        "is_genuine": is_genuine,
        "confidence": round(total_score, 2),
        "verdict": verdict,
        "checks": checks,
        "flags": flags
    }
