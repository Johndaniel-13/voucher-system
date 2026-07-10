"""
RAILWAY BACKEND — FastAPI Server
================================
Deploy on Railway with PostgreSQL. Railway auto-detects this and runs it.

Endpoints:
  POST /api/upload-vouchers     — Admin uploads Excel
  POST /api/request-voucher     — User submits payment screenshot
  GET  /api/voucher-status      — Check remaining vouchers
  GET  /api/export-issued       — Export issued vouchers as Excel
  GET  /api/health              — Health check

CONFIGURE ON RAILWAY:
  1. Add PostgreSQL service in Railway dashboard
  2. Set environment variable: TESSERACT_PATH=/usr/bin/tesseract
  3. Railway auto-provides DATABASE_URL
"""

import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from dotenv import load_dotenv

from database import init_db, insert_vouchers, get_unused_voucher, mark_voucher_used, get_voucher_count, get_all_issued
from excel_parser import parse_voucher_excel, export_issued_to_excel
from ocr import extract_utr_from_image
from forgery import is_genuine_screenshot

load_dotenv()

app = FastAPI(title="Voucher Code System", version="1.0.0")

# CORS — allow frontend (Vercel) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── STARTUP ───────────────────────────────────────────────

@app.on_event("startup")
def startup():
    """Initialize database tables on Railway startup."""
    try:
        init_db()
        print("✅ Database initialized on Railway!")
    except Exception as e:
        print(f"⚠️ Database init warning: {e}")
        print("Make sure PostgreSQL is added in Railway dashboard!")


# ─── ADMIN ENDPOINTS ──────────────────────────────────────

@app.post("/api/upload-vouchers")
async def upload_vouchers(file: UploadFile = File(...)):
    """
    ADMIN: Upload Excel file with voucher codes.
    Excel must have columns: Serial No. | Voucher Code
    """
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(400, "Please upload a valid Excel file (.xlsx or .xls)")

    try:
        contents = await file.read()
        vouchers = parse_voucher_excel(contents)

        if not vouchers:
            raise HTTPException(400, "No voucher codes found in the Excel file. Check column format.")

        insert_vouchers(vouchers)

        counts = get_voucher_count()

        return {
            "success": True,
            "message": f"✅ Uploaded {len(vouchers)} voucher codes!",
            "total_vouchers": counts["total"] or 0,
            "unused_vouchers": counts["unused"] or 0
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Error processing file: {str(e)}")


@app.get("/api/export-issued")
async def export_issued():
    """
    ADMIN: Download all issued vouchers as Excel.
    Columns: Payment UTR Number | Voucher Code | Issued At
    """
    issued = get_all_issued()

    if not issued:
        raise HTTPException(404, "No vouchers have been issued yet.")

    excel_bytes = export_issued_to_excel(issued)

    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=issued_vouchers.xlsx"}
    )


# ─── PUBLIC ENDPOINTS ─────────────────────────────────────

@app.post("/api/request-voucher")
async def request_voucher(screenshot: UploadFile = File(...)):
    """
    PUBLIC: User uploads payment screenshot to get a voucher code.

    Flow:
      1. User uploads payment screenshot
      2. OCR extracts UTR/payment number
      3. Forgery detection checks if screenshot is genuine
      4. If genuine → issue next available voucher code
      5. Store UTR + voucher code in database
    """
    # Step 1: Read the uploaded screenshot
    if not screenshot.content_type or not screenshot.content_type.startswith("image/"):
        raise HTTPException(400, "Please upload a valid image file (PNG, JPG, etc.)")

    image_bytes = await screenshot.read()

    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(400, "File too large. Maximum 10MB allowed.")

    # Step 2: Forgery detection — is this an AI-generated fake?
    forgery_result = is_genuine_screenshot(image_bytes)

    if not forgery_result["is_genuine"]:
        raise HTTPException(
            400,
            f"Screenshot rejected: {forgery_result['verdict']}. "
            f"Confidence: {forgery_result['confidence']}%. "
            f"Flags: {'; '.join(forgery_result['flags']) if forgery_result['flags'] else 'None'}"
        )

    # Step 3: OCR — extract UTR/payment number
    ocr_result = extract_utr_from_image(image_bytes)

    if not ocr_result["success"]:
        raise HTTPException(
            400,
            f"Could not detect payment reference number in screenshot. "
            f"OCR confidence: {ocr_result['confidence']}%. "
            "Please upload a clear screenshot."
        )

    utr_number = ocr_result["utr_number"]

    # Step 4: Issue a voucher code
    voucher = get_unused_voucher()

    if not voucher:
        raise HTTPException(400, "Sorry, all voucher codes have been claimed!")

    # Step 5: Save to database
    mark_voucher_used(voucher["voucher_code"], utr_number)

    counts = get_voucher_count()

    return {
        "success": True,
        "message": "✅ Payment verified! Here's your voucher code.",
        "voucher_code": voucher["voucher_code"],
        "utr_number": utr_number,
        "ocr_confidence": ocr_result["confidence"],
        "forgery_confidence": forgery_result["confidence"],
        "forgery_verdict": forgery_result["verdict"],
        "remaining_vouchers": counts["unused"] or 0
    }


@app.get("/api/voucher-status")
async def voucher_status():
    """PUBLIC: Check how many vouchers are left."""
    counts = get_voucher_count()
    return {
        "total": counts["total"] or 0,
        "unused": counts["unused"] or 0,
        "used": (counts["total"] or 0) - (counts["unused"] or 0)
    }


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    try:
        counts = get_voucher_count()
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "running",
        "database": db_status,
        "service": "Voucher Code System API"
    }


# ─── RUN ──────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
