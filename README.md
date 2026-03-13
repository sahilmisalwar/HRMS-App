# HRMS (Human Resource Management System)

A full-stack, modern HRMS designed for small to medium organizations to manage the candidate recruitment lifecycle. Built with React (Vite), TailwindCSS, FastAPI (Python), and PostgreSQL.

## Features
- **Secure Authentication:** JWT-based login, role-based access control.
- **HR Dashboard:** Metrics, recent applications, intuitive UI.
- **Candidate Management:** Add, search, filter, and track candidates.
- **Workflow & Tracking:** Update status (Applied → Interviewed → Offered → Onboarded).
- **Offer Letter Automation:** Generate and download PDF offer letters automatically.
- **Document Repository:** Upload and manage candidate files (resumes, etc.).
- **Data Export:** Export candidate list as CSV.

## Technical Stack
- **Frontend:** React, TailwindCSS, React Router, Lucide Icons
- **Backend:** FastAPI, SQLAlchemy, Pydantic, Python-Jose, ReportLab
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose

## Getting Started (Docker - Recommended)

### Prerequisites
- Docker and Docker Compose installed on your system.

### Running the Application
1. Clone the repository and navigate to the project directory:
   ```bash
   cd HRMS
   ```
2. Build and start the containers using Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
3. Initialize the database with example data:
   ```bash
   docker-compose exec backend python seed.py
   ```
   *This will create the default admin user:*
   - **Email:** `admin@hrms.com`
   - **Password:** `admin123`

4. Access the application:
   - **Frontend UI:** [http://localhost:5173](http://localhost:5173)
   - **Backend API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

## Project Structure
- `frontend/`: React Vite application, Tailwind configuration, UI components, pages.
- `backend/`: FastAPI application, models, routing, PDF generation logic.
- `docker-compose.yml`: Orchestration file for Postgres, API, and Frontend.

## Environment Variables
Environment variables are predefined in `docker-compose.yml` for quick setup, but you can override them in a `.env` file in production:
- `DATABASE_URL`: Connection string for PostgreSQL
- `JWT_SECRET`: Secret key for signing JWTs
- `UPLOAD_DIR`: Path to store uploaded candidate documents

## Future Enhancements
- Interview Scheduling
- Resume Parsing via AI
- Email Notifications (SMTP integration)
- Dark Mode support
