# Incident Analysis Service

An asynchronous service for triaging industrial incident reports.

## Overview

This project consists of a NestJS backend and a React frontend. It allows users to submit text-based incident reports which are then processed asynchronously. The system simulates a multi-step analysis process (PENDING -> PROCESSING -> COMPLETED/FAILED).

## Design Decisions & Trade-offs

### Backend (NestJS + TypeORM + SQLite)
- **Asynchronous Processing**: Instead of using a complex message broker (like Redis/Kafka) which was explicitly forbidden, I implemented async processing using Node.js `setTimeout` and background promises. This keeps the architecture simple and self-contained while satisfying the requirement for non-blocking workflows.
- **SQLite**: Chosen for its simplicity and zero-configuration. Perfect for a prototype/PoC.
- **TypeORM**: Used for clean data mapping and easy interaction with SQLite.

### Frontend (React + Vite)
- **Polling**: To retrieve the results of the asynchronous analysis, the frontend uses a polling strategy (every 2 seconds). This is a practical approach for a prototype where real-time sockets might be overkill.
- **State Management**: React's built-in `useState` and `useEffect` were sufficient for this scope.

### API
- **RESTful**: Follows standard REST patterns.
- **Swagger**: Integrated at `/api/docs` for easy API exploration and testing.

## Instructions

### Running with Docker (Recommended)

1. Ensure you have Docker and Docker Compose installed.
2. Run:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: [http://localhost:8080](http://localhost:8080)
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - Swagger Docs: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Running Manually

#### Backend
```bash
cd incident-analysis-api
npm install
npm run start:dev
```

#### Frontend
```bash
cd incident-analysis-app
npm install
npm run dev
```

### Running Tests
```bash
cd incident-analysis-api
npm run test
```

## AI Tool Usage

- **Tools used**: Junie (AI Assistant).
- **Usage**: Used for scaffolding the project, implementing the async logic, setting up Docker configurations, and generating this documentation.
- **Full Logs**: Can be found in `docs/ai-chat-log.md`.
