# 🎫 Voucher Code System

A complete voucher code management system with AI-powered payment verification.

## 📚 What You'll Learn

| Concept | What It Is | Where It's Used |
|---|---|---|
| **OCR (Optical Character Recognition)** | Extracts text from images | `backend/ocr.py` — reads UTR number from payment screenshots |
| **Image Forgery Detection** | Detects if screenshot is AI-generated or genuine | `backend/forgery.py` — checks EXIF, ELA, noise patterns |
| **Railway** | Auto-deploy platform for backend + database | Hosts the Python API + PostgreSQL |
| **Vercel** | Frontend hosting | Hosts the React pages |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   VERCEL (Frontend)          RAILWAY (Backend)   │
│   ┌─────────────┐           ┌──────────────┐     │
│   │ Landing Page │           │  FastAPI      │     │
│   │ Admin Page   │───API────▶│  OCR Engine   │     │
│   │ Public Page  │           │  Forgery Det. │     │
│   └─────────────┘           │  Excel Parser │     │
│                              │  PostgreSQL   │     │
│                              └──────────────┘     │
└──────────────────────────────────────────────────┘
```

## 🚀 Deployment Steps

### PART 1: Deploy Backend on Railway

1. **Go to [railway.app](https://railway.app)** → Sign up with GitHub

2. **Create New Project** → "Deploy from GitHub repo"

3. **Add PostgreSQL:**
   - In Railway dashboard, click "+ New" → "Database" → "PostgreSQL"
   - Railway auto-provides `DATABASE_URL` environment variable

4. **Push the `backend/` folder to GitHub:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend"
   git push
   ```

5. **Railway auto-deploys!** It reads `railway.toml` and:
   - Installs Tesseract OCR (system dependency)
   - Installs Python packages
   - Creates database tables on startup
   - Runs the FastAPI server

6. **Get your Railway URL** (e.g., `https://voucher-backend.railway.app`)

---

### PART 2: Deploy Frontend on Vercel

1. **Go to [vercel.com](https://vercel.com)** → Import your GitHub repo

2. **Set Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: Your Railway URL from Part 1 (e.g., `https://voucher-backend.railway.app`)

3. **Set Root Directory:** `frontend`

4. **Deploy!** Vercel auto-detects Vite and builds.

---

### PART 3: Test the System

1. **Create sample Excel:**
   ```bash
   cd backend
   python create_sample_excel.py
   ```
   This creates `sample_vouchers.xlsx` with 20 test voucher codes.

2. **Admin Page:** Go to `/admin/login` (password: `admin123`)
   - Upload the sample Excel
   - See stats update in real-time

3. **Public Page:** Go to `/claim`
   - Upload a payment screenshot
   - System runs OCR + forgery detection
   - If genuine → issues a voucher code

---

## 📁 Project Structure

```
voucher-system/
├── backend/                    # Deploy on Railway
│   ├── main.py                 # FastAPI server with all endpoints
│   ├── ocr.py                  # Tesseract OCR — extracts UTR from screenshots
│   ├── forgery.py              # AI-fake detection (EXIF, ELA, noise analysis)
│   ├── excel_parser.py         # Reads admin Excel & exports issued vouchers
│   ├── database.py             # PostgreSQL operations (CRUD)
│   ├── requirements.txt        # Python dependencies
│   ├── railway.toml            # Railway deployment config
│   ├── nixpacks.toml           # System dependencies (Tesseract)
│   └── create_sample_excel.py  # Utility: generates test Excel file
│
├── frontend/                   # Deploy on Vercel
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Router (Landing, Admin, Public)
│   │   ├── index.css           # Global styles
│   │   └── pages/
│   │       ├── Landing.jsx     # Homepage with links
│   │       ├── AdminLogin.jsx  # Admin password protection
│   │       ├── Admin.jsx       # Upload Excel, view stats, export data
│   │       └── Public.jsx      # Upload screenshot, get voucher code
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md                   # This file
```

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/upload-vouchers` | Admin uploads Excel with voucher codes |
| `POST` | `/api/request-voucher` | User uploads payment screenshot → gets voucher |
| `GET` | `/api/voucher-status` | Check remaining voucher count |
| `GET` | `/api/export-issued` | Download issued vouchers as Excel |
| `GET` | `/api/health` | Backend health check |

---

## 🧠 Key Concepts Explained

### OCR (Optical Character Recognition)
The technology that reads text from images. Your `ocr.py`:
1. Takes payment screenshot
2. Converts to grayscale + enhances contrast
3. Runs Tesseract OCR engine
4. Uses regex patterns to find UTR numbers like "UTR: ABC123456789"
5. Returns the extracted UTR + confidence score

### Forgery Detection
Checks if screenshot is genuine:
1. **EXIF Check** — Real phone screenshots have metadata (device, timestamp)
2. **ELA (Error Level Analysis)** — Saves at lower quality, compares differences
3. **Noise Analysis** — AI images have unnatural noise patterns
4. **Dimension Check** — Phone screenshots match standard aspect ratios

### Railway Auto-Deploy
When you push to GitHub, Railway:
- Detects the change automatically
- Rebuilds the project
- Redeploys without you touching anything
- That's the "cool feature" your mam mentioned!

---

## ⚠️ Important Notes

1. **Change the admin password** in `AdminLogin.jsx` before production
2. **Tesseract accuracy** depends on screenshot quality — clear screenshots work best
3. **Forgery detection** is heuristic-based — it's good but not 100% foolproof
4. **Railway free tier** has usage limits — good for testing, upgrade for production

---

## 📝 Test Flow

```
1. Admin logs in → uploads sample_vouchers.xlsx
2. Stats show: 20 total, 20 available, 0 claimed
3. User visits /claim → uploads a real payment screenshot
4. OCR extracts UTR (e.g., "UPI1234567890")
5. Forgery check passes (genuine screenshot)
6. User sees: VOUCH-001-RAJA
7. Stats update: 20 total, 19 available, 1 claimed
8. Admin exports → gets Excel with UTR + voucher code
```