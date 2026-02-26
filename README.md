# 🚀 Headhunt Recruitment System

Full-stack recruitment platform built with:

-   🖥 Backend: Spring Boot 3.5.10
-   🗄 Database: MySQL 8
-   ☁️ Cloud Storage: Microsoft Azure Blob Storage
-   🌐 Frontend: Vite + ReactJS

------------------------------------------------------------------------

# 🛠 Tech Stack

## 🔹 Backend

-   Java 21
-   Spring Boot 3.5.10
-   Spring Security (JWT Authentication)
-   Spring Data JPA (Hibernate)
-   MapStruct
-   Lombok
-   Maven

## 🔹 Database

-   MySQL 8
-   UUID Primary Key (VARCHAR 36)

## 🔹 Cloud

-   Microsoft Azure Blob Storage (Image & File Storage)

## 🔹 Frontend

-   Vite
-   ReactJS
-   Axios
-   React Router
-   TailwindCSS / CSS Modules (optional)

------------------------------------------------------------------------

# 🏗 System Architecture

Frontend (Vite ReactJS) ↓ REST API Backend (Spring Boot) ↓ MySQL
Database ↓ Azure Blob Storage (Images / Files)

------------------------------------------------------------------------

# 📂 Backend Project Structure

src/main/java/com/rikkeisoft/backend

-   config \# Security & configuration
-   controller \# REST Controllers
-   service \# Business logic
-   repository \# JPA repositories
-   model
    -   entity \# JPA entities
    -   dto \# Request / Response DTOs
    -   mapper \# MapStruct mappers

------------------------------------------------------------------------

# ☁️ Azure Blob Storage

Used for: - User profile images - Company logos - CV file uploads

Example configuration in application.yml:

spring: cloud: azure: storage: blob: account-name: your_account_name
account-key: your_account_key

Upload Flow: 1. Frontend sends file to backend 2. Backend uploads to
Azure Blob container 3. Azure returns file URL 4. URL stored in database

------------------------------------------------------------------------

# 🔐 Authentication & Authorization

-   Username & Password (LOCAL)
-   OAuth2 (Google extendable)
-   JWT Access Token
-   Role-based Authorization
-   BCrypt Password Encoding

Roles stored in account_role table via @ElementCollection.

------------------------------------------------------------------------

# ⚙️ Backend Setup

## 1️⃣ Clone Backend

git clone `<your-backend-repo>`{=html} cd headhunt-backend

## 2️⃣ Configure Database

spring: datasource: url: jdbc:mysql://localhost:3306/headhunt username:
root password: your_password jpa: hibernate: ddl-auto: validate

## 3️⃣ Run Backend

mvn clean install mvn spring-boot:run

Backend runs at: http://localhost:8080

------------------------------------------------------------------------

# 🌐 Frontend Setup (Vite + React)

## 1️⃣ Create Frontend

npm create vite@latest headhunt-frontend cd headhunt-frontend npm
install

## 2️⃣ Install Dependencies

npm install axios react-router-dom

## 3️⃣ Run Frontend

npm run dev

Frontend runs at: http://localhost:5173

------------------------------------------------------------------------

# 📌 Main Features

-   Account Registration & Login
-   Role-based Access Control
-   Company & Job Management
-   Job Application System
-   Commission Tracking
-   Forum Module
-   Azure Image Upload
-   Full-stack REST communication

------------------------------------------------------------------------

# 🚀 Future Improvements

-   Refresh Token mechanism
-   Email OTP verification
-   Redis caching
-   Docker containerization
-   CI/CD pipeline
-   Azure CDN integration

------------------------------------------------------------------------

# 👨‍💻 Author

huangdat\
Spring Boot & React Developer

------------------------------------------------------------------------

# 📄 License

For educational and internal training purposes.
