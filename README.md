# AI Log Analyzer

AI Log Analyzer is a production-ready log monitoring platform that integrates a modern React frontend, an Express/MongoDB backend, and a Python FastAPI AI service for anomaly detection and threat insight.

## 🚀 Overview

This repository contains a complete full-stack solution for:

- Uploading and parsing log files
- Detecting anomalies with both rule-based and AI-enhanced workflows
- Managing alerts and security incidents
- Displaying analytics through a responsive dashboard

## 📁 Project Structure

- `backend/` — Node.js Express API for authentication, log storage, upload parsing, analytics, and alert management
- `frontend/` — React + Vite web application with dashboards, log views, and AI insights
- `ai-service/` — Python FastAPI microservice responsible for ML/AI-driven anomaly detection
- `docker-compose.yml` — Multi-service definition for local development and deployment

## 🧰 Technology Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer, Helmet, CORS
- AI Service: Python, FastAPI, Uvicorn, scikit-learn, python-dotenv
- Containerization: Docker Compose

## 🔌 Service Endpoints

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- AI Service: `http://localhost:8000`

## ⚙️ Setup

### Prerequisites

- Node.js 18+
- npm
- Python 3.11+
- Docker & Docker Compose (recommended)

### Local Development

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### AI Service

```bash
cd ai-service
pip install -r requirement.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

> When running inside Docker, the backend is configured to call the AI service at `http://host.docker.internal:8000`.

### Run All Services with Docker Compose

```bash
docker compose up --build
```

## 🔐 Backend API Summary

### Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — User login and JWT issuance
- `GET /api/auth/me` — Retrieve current user profile

### Log Upload & Analysis

- `POST /api/v1/logs/upload` — Upload a log file (authenticated)
- `POST /api/v1/logs/parse/:fileId` — Parse a log file
- `GET /api/v1/logs/file-status/:fileId` — Check parsing status
- `POST /api/v1/logs/analyze/:fileId` — Analyze parsed logs

### Log Storage

- `GET /api/v1/logs` — Retrieve stored logs
- `GET /api/v1/logs/search` — Search logs
- `GET /api/v1/logs/:id` — Get log details by ID
- `DELETE /api/v1/logs/:id` — Delete a log entry
- `DELETE /api/v1/logs` — Bulk delete logs

### Alerts

- `GET /api/v1/alerts` — Get active alerts
- `GET /api/v1/alerts/stats` — Fetch alert statistics
- `POST /api/v1/alerts` — Create a new alert
- `PATCH /api/v1/alerts/:id/resolve` — Resolve an alert
- `DELETE /api/v1/alerts/:id` — Delete an alert

### Analytics

- `GET /api/v1/stats/dashboard` — Dashboard metrics
- `GET /api/v1/stats/by-ip` — Logs grouped by IP
- `GET /api/v1/stats/severity` — Severity distribution
- `GET /api/v1/stats/timeseries` — Log event trends

## 🤖 AI Service Endpoints

- `GET /` — Health check
- `POST /analyze` — AI-enhanced anomaly detection with metadata and explanations
- `POST /analyze-simple` — Lightweight rule-based anomaly detection

## 📝 Environment Configuration

Create `.env` files for each service as required:

- `backend/` — MongoDB connection string, JWT secret, and other backend settings
- `ai-service/` — AI service environment variables

## ✅ Testing

### Backend

```bash
cd backend
npm test
```

## 💡 Notes

- The frontend and backend can run independently in development.
- Docker Compose is the recommended approach for running the full stack locally.
- The AI service is designed as a separate microservice so it can be extended independently.
