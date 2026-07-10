"""
DATABASE LAYER — Railway PostgreSQL
====================================
Creates tables and handles all database operations.
Run once on startup: init_db() creates tables if they don't exist.
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

# Railway provides DATABASE_URL automatically when you add PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/vouchers")


def get_connection():
    """Get a database connection."""
    return psycopg2.connect(DATABASE_URL)


def init_db():
    """Create all tables if they don't exist. Call on startup."""
    conn = get_connection()
    cur = conn.cursor()

    # Table 1: Voucher codes uploaded by admin
    cur.execute("""
        CREATE TABLE IF NOT EXISTS vouchers (
            id SERIAL PRIMARY KEY,
            serial_no INTEGER NOT NULL,
            voucher_code VARCHAR(100) NOT NULL UNIQUE,
            is_used BOOLEAN DEFAULT FALSE,
            uploaded_at TIMESTAMP DEFAULT NOW()
        );
    """)

    # Table 2: Issued vouchers — who got which code + their payment UTR
    cur.execute("""
        CREATE TABLE IF NOT EXISTS issued_vouchers (
            id SERIAL PRIMARY KEY,
            voucher_code VARCHAR(100) REFERENCES vouchers(voucher_code),
            utr_number VARCHAR(100),
            screenshot_url TEXT,
            issued_at TIMESTAMP DEFAULT NOW()
        );
    """)

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Database tables ready!")


# ─── Voucher CRUD ───

def insert_vouchers(voucher_list: list[dict]):
    """Bulk insert vouchers from admin Excel upload."""
    conn = get_connection()
    cur = conn.cursor()
    for v in voucher_list:
        cur.execute(
            "INSERT INTO vouchers (serial_no, voucher_code) VALUES (%s, %s) ON CONFLICT (voucher_code) DO NOTHING;",
            (v["serial_no"], v["voucher_code"])
        )
    conn.commit()
    cur.close()
    conn.close()


def get_unused_voucher():
    """Get one unused voucher code (FIFO)."""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM vouchers WHERE is_used = FALSE ORDER BY id ASC LIMIT 1;")
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result


def mark_voucher_used(voucher_code: str, utr_number: str, screenshot_url: str = ""):
    """Mark a voucher as used and store who got it."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE vouchers SET is_used = TRUE WHERE voucher_code = %s;", (voucher_code,))
    cur.execute(
        "INSERT INTO issued_vouchers (voucher_code, utr_number, screenshot_url) VALUES (%s, %s, %s);",
        (voucher_code, utr_number, screenshot_url)
    )
    conn.commit()
    cur.close()
    conn.close()


def get_voucher_count():
    """Get total and unused counts."""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT COUNT(*) as total, SUM(CASE WHEN is_used = FALSE THEN 1 ELSE 0 END) as unused FROM vouchers;")
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result


def get_all_issued():
    """Get all issued vouchers (for admin export)."""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM issued_vouchers ORDER BY issued_at DESC;")
    results = cur.fetchall()
    cur.close()
    conn.close()
    return results
