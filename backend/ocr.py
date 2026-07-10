"""
OCR ENGINE — Extracts text from payment screenshots
====================================================
Uses Tesseract OCR (free, open-source).
Railway will need Tesseract installed — we handle that in the Dockerfile.

FLOW:
  1. Receive image
  2. Preprocess (grayscale, threshold, sharpen)
  3. Run Tesseract OCR
  4. Extract UTR / payment reference number using regex patterns
"""

import re
import io
from PIL import Image, ImageFilter, ImageEnhance
import pytesseract


# Common UTR / Transaction ID patterns found in Indian payment screenshots
UTR_PATTERNS = [
    r"(?:UTR|UTR\s*No|UTR\s*Number|Reference\s*No|Transaction\s*ID|Ref\s*No)[:\s]*([A-Za-z0-9]{8,30})",
    r"(?:UPI\s*Ref|UPI\s*Reference)[:\s]*([0-9]{10,14})",
    r"\b([A-Z]{2,4}[0-9]{8,16})\b",  # Generic UTR: 2-4 letters + 8-16 digits
    r"\b([0-9]{10,14})\b",             # Pure numeric UPI reference
]


def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Enhance image for better OCR accuracy.
    Steps: Convert to grayscale → Increase contrast → Sharpen → Threshold
    """
    # Convert to grayscale
    img = image.convert("L")

    # Increase contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2.0)

    # Sharpen
    img = img.filter(ImageFilter.SHARPEN)

    # Resize if too small (OCR needs at least 300 DPI equivalent)
    width, height = img.size
    if width < 1000:
        ratio = 1500 / width
        img = img.resize((1500, int(height * ratio)), Image.LANCZOS)

    return img


def extract_utr_from_image(image_bytes: bytes) -> dict:
    """
    Main OCR function — extracts UTR/payment number from screenshot.

    Returns:
        {
            "success": True/False,
            "utr_number": "ABC123456789" or None,
            "full_text": "all extracted text...",
            "confidence": 85.5
        }
    """
    # Open image from bytes
    image = Image.open(io.BytesIO(image_bytes))

    # Preprocess
    processed = preprocess_image(image)

    # Run OCR with Indian payment screenshot optimized settings
    custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/: - '

    try:
        full_text = pytesseract.image_to_string(processed, config=custom_config)
    except Exception:
        # Fallback without config
        full_text = pytesseract.image_to_string(processed)

    # Try to find UTR using patterns
    utr_number = None
    for pattern in UTR_PATTERNS:
        match = re.search(pattern, full_text, re.IGNORECASE)
        if match:
            utr_number = match.group(1).strip()
            break

    # Get confidence score
    try:
        data = pytesseract.image_to_data(processed, output_type=pytesseract.Output.DICT)
        confidences = [int(c) for c in data["conf"] if c != "-1"]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
    except Exception:
        avg_confidence = 0

    return {
        "success": utr_number is not None,
        "utr_number": utr_number,
        "full_text": full_text.strip(),
        "confidence": round(avg_confidence, 2)
    }
