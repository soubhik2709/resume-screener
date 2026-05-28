# Resume Screener

An AI-powered full-stack web application that automates resume screening by comparing uploaded resumes against a Job Description (JD), generating matching scores, and ranking candidates based on relevance.

## Features

* Upload resumes (PDF/DOCX)
* Compare resumes with job descriptions
* Calculate resume match score
* Rank candidates automatically
* Backend API with TypeScript and Express
* MySQL database integration
* File upload handling with Multer

## Tech Stack

### Frontend

* React / Next.js
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* TypeScript
* Multer

### Database

* MySQL

## Project Structure

```bash
frontend/
backend/
database/
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Run backend server

```bash
npm run dev
```

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=rootsql
DB_PASSWORD=your_mysql_password
DB_NAME=resume_screener
```

## Future Improvements

* AI/NLP-based resume analysis
* Authentication system
* Dashboard analytics
* Resume keyword extraction
* Candidate filtering


