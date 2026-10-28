# Meeting Minutes Generator

A web application that converts meeting transcripts into structured meeting minutes with decisions, action items, and participants — powered by AI with strict anti-hallucination guardrails.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Python, FastAPI, Pydantic |
| AI | Google Gemini (swappable) |

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Git

### 1. Clone & Setup Environment

```bash
# Copy environment variables
cp .env.example backend/.env

# Edit backend/.env and add your Gemini API key
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API requests to `http://localhost:8000`.

## Project Structure

```
meeting-minutes-generator/
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── components/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
├── backend/           # Python + FastAPI
│   └── app/
│       ├── main.py        # FastAPI app
│       ├── config.py      # Settings
│       ├── models/        # Pydantic schemas
│       ├── routers/       # API endpoints
│       └── services/      # AI/LLM logic
├── .env.example
├── .gitignore
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/meetings/generate` | Generate structured minutes from transcript |
| GET | `/api/health` | Health check |

## License

MIT
