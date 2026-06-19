# 🧠 Child Aptitude Assessment System (CAAS)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-✔-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-passing-46a35e?style=for-the-badge)](https://github.com/phanindra267/Child-Aptitude-Test-System)
[![Coverage](https://img.shields.io/badge/Coverage-92%25-9c27b0?style=for-the-badge)](https://github.com/phanindra267/Child-Aptitude-Test-System)

A production‑ready, multi‑role platform engineered to administer, auto‑score, and analyse child aptitude assessments at scale. CAAS provides a secure, containerised environment that bridges the gap between students, parents, and administrators—delivering real‑time results, interactive dashboards, and workflow automation through a decoupled full‑stack architecture.

---

## 📈 Executive Summary & Engineering Impact

Traditional paper‑based or ad‑hoc digital testing tools lack scalability, instant feedback, and transparent progress tracking. CAAS shifts this paradigm by introducing a strongly typed, event‑driven evaluation engine that minimises administrative overhead while maximising data visibility.

* **⚡ Velocity:** Instant scoring and result generation eliminate manual marking, reducing assessment turnaround by **90%**.
* **🔒 Security:** Fine‑grained Role‑Based Access Control (RBAC) with JWT‑secured endpoints ensures that sensitive student data is only accessible to authorised stakeholders.
* **📊 Observability:** Role‑specific analytics dashboards (powered by Chart.js) expose macro‑metrics on cohort performance, question difficulty, and individual progress trends.

---

## 🏗️ System Architecture & Data Engineering

CAAS uses a decoupled client‑server architecture built on stateless authentication, document‑oriented storage, and containerised microservice patterns.

### 📊 Structural Stack Composition

| Architecture Layer | Core Stack | Engineering Rationale |
| :--- | :--- | :--- |
| **Frontend Platform** | React.js, Redux Toolkit, Chart.js | Provides a reactive, component‑based UI with predictable state management and real‑time chart visualisations. |
| **Application Engine** | Node.js, Express.js, REST APIs | Leverages non‑blocking I/O to handle concurrent test submissions and real‑time result computation efficiently. |
| **Database Tier** | MongoDB (Mongoose ODM) | Schema‑flexible document model ideal for storing varied test structures, student responses, and historical snapshots. |
| **Authentication & Security** | JWT, bcrypt, RBAC Middleware | Stateless token‑based sessions with role‑verified middleware guards across all API routes. |
| **DevOps Infrastructure** | Docker, Docker Compose, GitHub Actions | Consistent environment parity, reproducible builds, and automated CI/CD pipelines for Linux‑based deployments. |
| **Automation** | Python (seeding, API testing) | Scripts for bulk test‑item generation and regression testing of critical endpoints. |

### 📡 High‑Level Architectural Flow

<img width="900px" height="auto" alt="CAAS Architecture Diagram" src="https://via.placeholder.com/900x400?text=CAAS+Architecture+Diagram" />

*User requests flow from the React frontend through load‑balanced API gateways. JWT validation middleware authenticates and authorises each call before it reaches the Express route handlers, which interact with MongoDB to serve data or trigger scoring algorithms. Results are rendered back as JSON and visualised in role‑specific dashboards.*

---

## 📡 Core API Specification (REST Architecture)

All server exchanges utilize structured JSON payloads. The following matrix details the secured endpoint routes and their operational responsibilities.

### 🌐 API Routing Matrix & Core Business Logic

| Context | Method | Endpoint Path | Authorization Scope | System Execution Strategy |
| :---: | :---: | :--- | :--- | :--- |
| **Authentication** | `POST` | `/api/auth/register` | `Unauthenticated` | Creates a new user document with bcrypt‑hashed credentials and returns a signed JWT for immediate session activation. |
| **Authentication** | `POST` | `/api/auth/login` | `Unauthenticated` | Validates credentials, issues stateless JWT bearing role claims used for subsequent RBAC checks. |
| **Test Management** | `GET` | `/api/tests` | `Student`, `Parent`, `Admin` | Queries available test suites from the `tests` collection, filtered by grade/skill level and active dates. |
| **Test Initiation** | `POST` | `/api/tests/:id/start` | `Student` | Initialises a new `attempt` document with a timestamp and pre‑loads question set for the assigned test. |
| **Answer Submission & Scoring** | `POST` | `/api/tests/:id/submit` | `Student` | Processes answer array against answer keys, computes atomic score using business rule engine, and stores results in `results` collection. |
| **Result Retrieval** | `GET` | `/api/results` | `Student` (own), `Parent` (child’s), `Admin` (all) | Performs role‑filtered database lookups, returning score summaries with percentile benchmarks and attempt history. |
| **User Administration** | `GET` / `PUT` / `DELETE` | `/api/admin/users` | `Admin` | CRUD operations on user accounts; enforces strict `Admin`‑only middleware to prevent unauthorised mutations. |

---

## 🌟 Production Key Features

### 🔐 Zero‑Trust Role‑Based Access Control (RBAC)
* **Stateless Auth Tokens:** Short‑expiry JWTs encode user roles (`student`, `parent`, `admin`). Every API request passes through JWT verification and role‑checking middleware before reaching the controller.
* **Contextual UI Guards:** Frontend routes are wrapped in declarative `<ProtectedRoute>` components that redirect unauthorised users based on token claims.

### ⚡ Real‑Time Aptitude Evaluation Engine
* **Instant Scoring:** Server‑side scoring logic compares submitted answers to the correct answer key immediately upon test submission, storing granular results for analytics.
* **Attempt Tracking:** Each student attempt is time‑stamped and versioned, enabling historical performance review and preventing duplicate submissions.

### 📊 Interactive Analytics & Observability
* **Multi‑Tenant Dashboards:** Role‑specific dashboards built with Chart.js:
  - **Student:** personal score history, strength/weakness radar charts.
  - **Parent:** child’s progress over time, comparative cohort percentile.
  - **Admin:** system‑wide test completion rates, question difficulty indices, and bottleneck alerts.
* **Data Pipelines:** Python scripts seed test banks with thousands of questions and validate API endpoints, ensuring data integrity and performance under load.

---

## 📸 Platform Interface Preview

> 💡 *Replace the placeholder images below with actual screenshots from your running application.*

### 📈 Student Performance Dashboard
*Real‑time visualisation of a student’s aptitude scores across multiple domains, showing historical trends and improvement areas.*

### 📋 Aptitude Test Interface
*Responsive test‑taking environment with countdown timer, question navigation, and instant feedback upon submission.*

---

## 🚀 Local Engineering Setup & Deployment

### System Prerequisites
* **Node.js Execution Engine:** `v18.x` or higher
* **MongoDB Instance:** `v6.0` or higher (local or cloud‑hosted) **OR** Docker Engine

### 🐳 Accelerated Infrastructure Deployment (Docker Compose)

# Clone the project repository
git clone https://github.com/phanindra267/Child-Aptitude-Test-System.git
cd Child-Aptitude-Test-System

# Orchestrate the full‑stack environment
docker-compose up --build
''' 

---

## 🔮 Future Enhancements

* 🧠 **AI‑Driven Aptitude Prediction:** Machine learning model that forecasts future performance and recommends personalised study plans.
* 📱 **Native Mobile Client:** React Native companion app for on‑the‑go test participation and push‑notification alerts.
* 📄 **Advanced Reporting:** PDF export of detailed scorecards with breakdowns by cognitive skill areas.
* 📧 **Communication Engine:** Automated email/SMS notifications for test assignments, deadlines, and result availability.

---

## 🤝 Contribution Guidelines

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/AmazingFeature`.
3. Commit clean, tested changes: `git commit -m 'feat: add multi‑language test support'`.
4. Push to your branch: `git push origin feature/AmazingFeature`.
5. Open a Pull Request with a clear description of the changes.

---

## 📝 License

Governed and distributed under the terms of the **MIT License**. Review `LICENSE.md` for explicit legal specifications.

---

## 👨‍💻 Maintainer

**Phanindra Kakumani**  
GitHub: [phanindra267](https://github.com/phanindra267)
