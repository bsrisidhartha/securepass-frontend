# SecurePass — PRISM-Inspired Cybersecurity Platform

> **Security intelligence beyond passwords.**

SecurePass is an auditable cybersecurity platform and password intelligence analyzer inspired by the visual design hierarchy and deterministic transparency of the [PRISM platform](https://prism-murex-five.vercel.app/).

---

## 1. Architecture & Design

- **Frontend**: React 19, Vite, Lucide React, Custom Dark Mode Cybersecurity Design System.
  - Dark navy and near-black surfaces (`#060913`, `#0a0f1d`, `#111a30`).
  - Subtle blue, cyan, and violet ambient glow lighting.
  - High-contrast amber/yellow primary action buttons (`#f59e0b` / `#fbbf24`).
  - Editorial typography (`Plus Jakarta Sans` & `JetBrains Mono`).
  - 7-stage horizontal pipeline timeline: `Input → Validation → Analysis → Verification → Risk Check → Recommendations → Report`.
  - Live interactive security console with animated score meter, rule compliance matrix, sample presets, and actionable hardening guidance.
  - Dedicated **Glass Box** transparency section explaining the exact scoring mechanics and formulas.
  - Responsive layout for desktop, tablet, and mobile with accessible mobile navigation.
- **Backend**: Java 17, Spring Boot (`com.securepass.backend`).
  - Endpoint: `POST /api/password/analyze`
  - In-memory processing: Passwords are evaluated strictly in transient memory. Zero database persistence.
  - Configurable server port via `${PORT:8080}` for cloud container environments.
  - Multi-origin CORS support for local development (`localhost:5173`) and cloud deployments (`*.vercel.app`).

---

## 2. Local Development

### Prerequisites
- Java 17+ (JDK)
- Apache Maven 3.8+
- Node.js 18+ and npm

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd securepass-backend
   ```
2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start at `http://localhost:8080`.
   Verify the endpoint:
   ```bash
   curl -X POST http://localhost:8080/api/password/analyze \
     -H "Content-Type: application/json" \
     -d '{"password":"SamplePassword123!"}'
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd "secure pass/securepass-frontend"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file (optional, defaults to `http://localhost:8080`):
   ```env
   VITE_API_URL=http://localhost:8080
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## 3. Cloud Deployment Guide

### A. Backend Deployment (Render)
1. Push `securepass-backend` to a GitHub repository (e.g., `username/securepass-backend`).
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** → **Web Service**.
4. Connect the GitHub repository containing the backend.
5. Configuration:
   - **Environment**: Docker (Render will auto-detect the included `Dockerfile` and `render.yaml`).
   - **Plan**: Free.
   - **Environment Variables**:
     - `PORT`: `10000` (Render default).
6. Click **Create Web Service**.
7. Once deployed, note your public backend URL:
   `https://<your-app-name>.onrender.com`
8. Test the live health/endpoint:
   ```bash
   curl -X POST https://<your-app-name>.onrender.com/api/password/analyze \
     -H "Content-Type: application/json" \
     -d '{"password":"CyberSecurity2026!"}'
   ```

### B. Frontend Deployment (Vercel)
1. Push `securepass-frontend` to a GitHub repository (e.g., `username/securepass-frontend`).
2. Log in to [Vercel](https://vercel.com/) and click **Add New...** → **Project**.
3. Import the frontend repository.
4. Framework Preset: **Vite**.
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://<your-backend-name>.onrender.com`
6. Click **Deploy**.
7. Vercel will build the project and output your live production URL:
   `https://<your-project-name>.vercel.app`

---

## 4. Security & Privacy Disclaimers

1. **Transient Memory Execution**: Passwords submitted to the analyzer are evaluated strictly in transient RAM by the rules engine and are never stored in log files, persistent relational tables, or external disks.
2. **In-Memory H2 Database**: The Spring Boot backend utilizes an in-memory H2 database for local testing. No persistent session records or user credentials survive service restarts.
3. **Educational Heuristic Scope**: The 0–100 score represents deterministic compliance with fundamental complexity rules. It is an educational guideline and does not guarantee absolute immunity against credential stuffing, phishing, or endpoint keyloggers.
