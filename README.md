# AI Log Analyzer

AI Log Analyzer is a full-stack log analysis platform that combines a React/Vite frontend, an Express/MongoDB backend, and a Python FastAPI AI service for anomaly detection.

## Project Structure

- `backend/` - Node.js Express API for authentication, log storage, uploads, analysis, alerts, and statistics
- `frontend/` - React + Vite web UI for login, log upload, dashboard, alerts, and AI-driven insights
- `ai-service/` - Python FastAPI microservice for AI-based anomaly detection and enhanced log analysis
- `docker-compose.yml` - Local multi-service orchestration for backend, frontend, and AI service

## Technology Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer, Helmet, CORS
- AI Service: Python, FastAPI, Uvicorn, scikit-learn, python-dotenv
- Containerization: Docker Compose

## Service Ports

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- AI Service: `http://localhost:8000`

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Python 3.11+
- Docker & Docker Compose (optional but recommended)

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

> The backend expects the AI service to be available at `http://host.docker.internal:8000` when running inside Docker.

### Docker Compose

Use Docker Compose to build and run all services together:

```bash
docker compose up --build
```

## Backend API Overview

The backend exposes the following main API groups:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and issue JWT
- `GET /api/auth/me` - Get current user profile

- `POST /api/v1/logs/upload` - Upload a log file (authenticated)
- `POST /api/v1/logs/parse/:fileId` - Parse an uploaded log file
- `GET /api/v1/logs/file-status/:fileId` - Check file processing status
- `POST /api/v1/logs/analyze/:fileId` - Analyze parsed logs

- `GET /api/v1/logs` - Get saved logs
- `GET /api/v1/logs/search` - Search logs
- `GET /api/v1/logs/:id` - Get log record by ID
- `DELETE /api/v1/logs/:id` - Delete a single log
- `DELETE /api/v1/logs` - Bulk delete logs

- `GET /api/v1/alerts` - List alerts
- `GET /api/v1/alerts/stats` - Get alert statistics
- `POST /api/v1/alerts` - Create an alert
- `PATCH /api/v1/alerts/:id/resolve` - Resolve an alert
- `DELETE /api/v1/alerts/:id` - Delete an alert

- `GET /api/v1/stats/dashboard` - Dashboard statistics
- `GET /api/v1/stats/by-ip` - Logs grouped by IP
- `GET /api/v1/stats/severity` - Severity statistics
- `GET /api/v1/stats/timeseries` - Time-series log stats

## AI Service Endpoints

The AI service provides advanced log analysis endpoints:

- `GET /` - Health check
- `POST /analyze` - AI-enhanced anomaly analysis with detailed detection metadata
- `POST /analyze-simple` - Fast rule-based anomaly analysis without AI explanation

## Installation Notes

- Backend dependencies are managed in `backend/package.json`
- Frontend dependencies are managed in `frontend/package.json`
- AI service Python dependencies are managed in `ai-service/requirement.txt`

## Environment Configuration

Create service-level `.env` files as needed for:

- `backend` - MongoDB connection string, JWT secret, and other runtime values
- `ai-service` - AI service environment variables

## Testing

### Backend

```bash
cd backend
npm test
```

## Development Tips

- The frontend and backend are configured to run independently in development.
- Docker Compose is the easiest way to run the full stack together.
- Use authenticated routes for log management, alerting, and statistics.

## Notes

- The project combines ML/AI-powered log anomaly detection with a full web-based observability workflow.
- The backend includes log upload parsing, storage, alert handling, and dashboard analytics.
- The AI service is designed to be its own microservice and can be extended with additional detection models.
