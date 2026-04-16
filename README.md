# HMCTS Caseworker Task Management System

This workspace contains a production-ready task management system for HMCTS caseworkers, including:
- `backend/` — Node.js + Express API using PostgreSQL and Prisma
- `frontend/` — React + Vite application

## Setup

### Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment example and configure Postgres values:
   ```bash
   cp .env.example .env
   ```
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
5. Apply the database schema:
   ```bash
   npm run prisma:migrate -- --name init
   ```
6. Start the backend locally:
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment example and configure the API URL:
   ```bash
   cp .env.example .env
   ```
4. Start the frontend locally:
   ```bash
   npm run dev
   ```

## API Documentation

### Endpoints
- `POST /tasks` — create a new task
- `GET /tasks` — list all tasks
- `GET /tasks/:id` — get a task by ID
- `PATCH /tasks/:id/status` — update a task status
- `DELETE /tasks/:id` — delete a task

### Task model
- `id` — UUID
- `title` — required string
- `description` — optional string
- `status` — one of `TODO`, `IN_PROGRESS`, `DONE`
- `dueDate` — required date-time
- `createdAt` — auto-generated timestamp

## Design decisions
- Clean architecture with controllers, services, routes, validation, and middleware
- Input validation using `zod`
- Global error handling middleware with proper HTTP status codes
- Logging middleware for request tracing
- React UI with simple GOV-style layout and accessible forms
- Environment variables used for configuration and API URL

## Assumptions
- PostgreSQL is available for backend development and deployment.
- The frontend will call the backend through a REST API.
- Simple local deployment is sufficient for initial HMCTS caseworker workflow.
