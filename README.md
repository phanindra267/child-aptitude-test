# 🧠 Child Aptitude Assessment System (CAAS)

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/phanindra267/Child-Aptitude-Test-System?color=0052CC&style=for-the-badge)](https://github.com/phanindra267/Child-Aptitude-Test-System)
[![Build & Deployment Status](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-brightgreen?style=for-the-badge&logo=github-actions)](https://github.com/phanindra267/Child-Aptitude-Test-System)
[![Docker Support](https://img.shields.io/badge/Docker-Containerized-2496ed?style=for-the-badge&logo=docker)](https://github.com/phanindra267/Child-Aptitude-Test-System)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://github.com/phanindra267/Child-Aptitude-Test-System)

An enterprise-grade, full-stack psychometric evaluation platform designed to systematically measure, analyze, and track cognitive development metrics in children. Built with high runtime performance and analytical precision in mind, this centralized portal serves three distinct user spaces—Students, Parents, and Administrators—offering real-time automated assessment evaluation, high-performance data processing pipelines, and beautiful dashboard analytics.

---

## 📈 Platform Metrics & Business Impact

Traditional examination systems rely on manual scoring, causing reporting delays, human grading bias, and fragmented storage of long-term metrics. CAAS eliminates this operational debt.

* **⚡ Sub-Second Automated Scoring:** Real-time generation of multi-variable assessment feedback immediate upon submission.
* **🔒 Granular Access Matrices:** End-to-end zero-trust data segregation protecting confidential student profiles.
* **📊 Dynamic Diagnostic Reporting:** Visual trend charts evaluating mathematical, logical, and verbal capabilities seamlessly over time.

---

## 🏗️ System Architecture & Workflow

The platform utilizes a decoupled client-server architecture built on transactional API layers, secure token-passing middlewares, and dynamic document data models.

### 📡 System Logic & Assessment Pipeline

```mermaid
graph TD
    %% Base Styling
    classDef client fill:#e3f2fd,stroke:#0d47a1,stroke-width:2px,color:#000;
    classDef gateway fill:#eceff1,stroke:#37474f,stroke-width:2px,color:#000;
    classDef app fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000;
    classDef storage fill:#efebe9,stroke:#3e2723,stroke-width:2px,color:#000;

    %% Elements
    A[React Client / Redux State]:::client -->|HTTPS Request + JWT| B[API Gateway / Router Middleware]:::gateway
    B --> C{RBAC Guard Validation}:::gateway
    
    C -->|Student Scope| D[Assessment Real-Time Engine]:::app
    C -->|Parent/Admin Scope| E[Analytics & Reporting Pipeline]:::app
    
    D -->|Atomic Document Writes| F[(MongoDB Database)]:::storage
    E -->|Aggregated Metrics Pipeline| F
    
    G[Python Seeding & Testing Automation] -.->|Direct Mock Data Ingestion| B
