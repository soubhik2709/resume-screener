# 📄 Resume Screener — Candidate Ranking Web Application

An intelligent full-stack web application that automates resume screening by comparing uploaded resumes against a Job Description (JD), generating match scores, and ranking candidates from highest to lowest fit. Built for HR teams to streamline initial candidate screening.

---

## ✨ Features

- **Multi-Resume Upload** — PDF and DOCX formats, single or batch upload (up to 10 files)
- **Job Description Input** — Paste JD text directly into the dashboard
- **Intelligent Scoring** — 0–100 match score based on keyword similarity
- **Candidate Ranking** — Automatic sorting from highest to lowest fit
- **Results Dashboard** — View ranks, scores, matching/missing skills at a glance
- **Export to CSV** — Download full ranked results as a spreadsheet
- **Session History** — All screening sessions saved to MySQL database
- **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type-safe code |
| Tailwind CSS v4 | Styling and responsiveness |
| Axios | API communication |
| Sonner | Toast notifications |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| TypeScript | Type-safe backend |
| Multer | File upload handling |
| pdf-parse | PDF text extraction |
| Mammoth | DOCX text extraction |
| string-similarity | Match scoring algorithm |

### Database
| Technology | Purpose |
|------------|---------|
| MySQL 8+ | Relational database |
| mysql2 | MySQL driver for Node.js |

---

## 📁 Project Structure

```
resume-screener/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request & response handlers
│   │   ├── middleware/         # Multer file storage config
│   │   ├── routes/             # Express API route definitions
│   │   └── services/           # Core logic (database, parser)
│   ├── .env.example            # Template for environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── globals.css         # Global styles + Tailwind v4
│   │   ├── layout.tsx          # Root layout with Sonner Toaster
│   │   └── page.tsx            # Main screening dashboard
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MySQL** v8 or higher
- **npm** package manager

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/resume-screener.git
cd resume-screener
```

---

### 2. Set Up the Database

**Option A — MySQL Workbench (recommended on Windows):**
1. Open MySQL Workbench and connect to your local instance
2. Go to **File → Open SQL Script**
3. Open `database/schema.sql` and click the ⚡ button to run it

**Option B — Command line (if MySQL is in your PATH):**
```bash
mysql -u root -p < database/schema.sql
```

> **Windows tip:** If `mysql` is not recognized, add it to your PATH:
> `C:\Program Files\MySQL\MySQL Server 8.0\bin`

---

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
DB_HOST=localhost
SCREENER_DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=resume_screener
```

> Make sure the file is named `.env` not `.env.txt` — Windows sometimes hides extensions.

---

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 5. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ▶️ Running the Application

**Terminal 1 — Start the backend:**
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:5000`

**Terminal 2 — Start the frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:3000`

---

## 📖 How to Use

1. **Upload Resumes** — Click the upload area and select PDF or DOCX files
2. **Enter Job Description** — Paste the full JD text into the textarea
3. **Analyze** — Click the **Analyze Resumes** button
4. **View Results** — See candidates ranked with match score, matching skills, and missing skills
5. **Export** — Click **Export CSV** to download the ranked results

---

## 🔄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resumes/screen` | Upload resumes + JD, returns ranked candidates |
| `GET` | `/api/resumes/session/:sessionId` | Fetch results for a past session |
| `GET` | `/api/resumes/export/:sessionId` | Download CSV of session results |

### Sample Response

```json
{
  "success": true,
  "sessionId": 1,
  "totalCandidates": 3,
  "candidates": [
    {
      "rank": 1,
      "candidateName": "John Doe",
      "matchScore": 85,
      "matchingSkills": ["react", "typescript", "nodejs"],
      "missingSkills": ["docker", "aws"],
      "resumePreview": "Experienced full-stack developer..."
    }
  ]
}
```

---

## 📊 Database Schema

```sql
screening_sessions       -- One row per screening run
├── id (PK)
├── job_description
└── created_at

candidates               -- One row per resume per session
├── id (PK)
├── session_id (FK)
├── candidate_name
├── match_score
├── rank_position
└── resume_preview

matching_skills          -- Skills found in resume
├── id (PK)
├── candidate_id (FK)
└── skill_name

missing_skills           -- Skills missing from resume
├── id (PK)
├── candidate_id (FK)
└── skill_name
```

---

## ⚠️ Known Limitations

- Scoring is keyword-based, not semantic — no AI embeddings or NLP model
- No authentication — anyone with the URL can access all sessions
- File size limit: 10 files per upload (Multer default)
- Only PDF and DOCX formats are supported

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

