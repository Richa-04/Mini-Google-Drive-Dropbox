# 🚀 Mini Google Drive - Smart Document Management System

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)]()
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)]()
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![Material UI](https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)]()

> A modern, secure cloud-based document management system with file encryption, intelligent search, and seamless sharing capabilities.

---

## 📑 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [System Architecture](#-system-architecture)
- [Screenshots](#-screenshots)
- [API Documentation](#-api-documentation)
- [Team](#-team)
- [License](#-license)

---

## 🌟 Overview

**Mini Google Drive** is a full-stack document management system that revolutionizes how users store, organize, and retrieve files. Built with enterprise-grade security and modern design principles, it provides a seamless experience for managing documents in the cloud.

### 💡 Why This Project?

Modern businesses and individuals face significant challenges with document management:
- **2 hours/day** wasted searching for documents
- **46%** of workers struggle to find needed files
- Growing need for **secure, encrypted storage**
- Demand for **intelligent search** beyond simple keywords

Our solution addresses these challenges with cutting-edge technology and intuitive design.

---

## ✨ Features

### 🔐 Security & Authentication
- **JWT-based Authentication**: Secure login/signup with token-based sessions
- **AES-256 Encryption**: All files encrypted before storage
- **Password Protection**: BCrypt hashing for user credentials
- **Secure API Endpoints**: Protected routes with authentication middleware

### 📤 File Management
- **Upload & Storage**: Drag-and-drop file upload with real-time progress
- **Download & Preview**: View files directly in browser or download
- **Delete Operations**: Secure file deletion with confirmation
- **File Organization**: Smart categorization and sorting

### 🤝 Collaboration
- **File Sharing**: Share files with multiple users via email
- **Access Control**: Owner-based permissions system
- **Shared Files View**: Dedicated section for files shared with you

### 🔍 Smart Search
- **Real-time Search**: Instant file filtering as you type
- **Multiple Views**: 
  - **Dashboard**: Recent files (last 7 days)
  - **My Documents**: All your uploaded files
  - **Shared with Me**: Files others have shared

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Beautiful Gradients**: Eye-catching purple gradient theme
- **Smooth Animations**: Polished hover effects and transitions
- **File Type Icons**: Visual indicators for PDFs, images, documents
- **Storage Analytics**: Real-time storage usage tracking

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Java 17** | Core programming language |
| **Spring Boot 3.5.7** | Web framework and REST API |
| **Spring Security** | Authentication & authorization |
| **Spring Data MongoDB** | Database integration |
| **JWT (jjwt 0.11.5)** | Token-based authentication |
| **Maven** | Build automation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Material-UI (MUI)** | Component library |
| **React Router 6** | Navigation |
| **Axios** | HTTP client |

### Database & Storage
| Technology | Purpose |
|------------|---------|
| **MongoDB Atlas** | NoSQL database for metadata |
| **Local File System** | Encrypted file storage |

### Security
| Technology | Purpose |
|------------|---------|
| **AES-256** | File encryption algorithm |
| **BCrypt** | Password hashing |
| **JWT** | Stateless authentication |

---

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have:
```bash
✅ Java 17 or higher
✅ Node.js 16+ and npm
✅ MongoDB Atlas account (free tier)
✅ Git
```

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Richa-04/Mini-Google-Drive-Dropbox.git
cd Mini-Google-Drive-Dropbox
```

#### 2️⃣ Backend Setup
```bash
# Navigate to backend
cd backend

# Configure MongoDB (edit src/main/resources/application.properties)
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
spring.data.mongodb.database=minigoogledrive
jwt.secret=your-secret-key-here-min-256-bits
jwt.expiration=86400000

# Build and run
mvn clean install
mvn spring-boot:run
```

**Backend runs on:** `http://localhost:8080`

#### 3️⃣ Frontend Setup
```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend runs on:** `http://localhost:3000`

### 🎯 Quick Start

1. **Create Account**: Navigate to signup page and create your account
2. **Upload Files**: Click the floating **+** button to upload files
3. **Manage Files**: Open, download, share, or delete files from the dashboard
4. **Share Files**: Click 3 dots → Share → Enter recipient's email
5. **Search**: Use the search bar to find files instantly

---

## 🏗️ System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │  Signup  │  │Dashboard │  │  Search  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API (Axios)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Spring Boot)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Service │  │ File Service │  │   Security   │      │
│  │    (JWT)     │  │ (Encryption) │  │   (Filter)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────┬─────────────────┬────────────────────────────────┘
            │                 │
            ▼                 ▼
    ┌──────────────┐  ┌──────────────┐
    │   MongoDB    │  │ Local Storage│
    │  (Metadata)  │  │  (Encrypted) │
    └──────────────┘  └──────────────┘
```

### Data Flow

**File Upload Process:**
1. User selects file → Frontend validates
2. File sent to Spring Boot API with JWT token
3. Backend generates AES encryption key
4. File encrypted and saved to local storage
5. Metadata (filename, owner, encryption key) saved to MongoDB
6. Success response sent to frontend

**File Retrieval Process:**
1. User requests file → JWT validated
2. Backend fetches metadata from MongoDB
3. Encrypted file read from storage
4. File decrypted using stored key
5. Decrypted file sent to user

---

## 📡 API Documentation

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: { "token": "jwt_token", "email": "...", "firstName": "...", "lastName": "..." }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { "token": "jwt_token", "email": "...", "firstName": "...", "lastName": "..." }
```

---

## 📂 Project Structure
```
Mini-Google-Drive-Dropbox/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/project/googledrive/
│   │   │   │   ├── config/          # Security, CORS configuration
│   │   │   │   ├── controller/      # REST API endpoints
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── model/           # Entity classes (User, FileMetadata)
│   │   │   │   ├── repository/      # MongoDB repositories
│   │   │   │   ├── security/        # JWT utilities, filters
│   │   │   │   ├── service/         # Business logic
│   │   │   │   └── util/            # Encryption utilities
│   │   │   └── resources/
│   │   │       └── application.properties  # Configuration
│   │   └── test/                    # Unit tests
│   ├── uploads/                     # Encrypted file storage
│   └── pom.xml                      # Maven dependencies
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Images, logos
│   │   ├── components/              # React components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/                 # Auth context
│   │   │   └── AuthContext.jsx
│   │   ├── services/                # API calls
│   │   │   └── api.js
│   │   └── App.js                   # Main app component
│   └── package.json                 # npm dependencies
│
└── README.md
```

---

## 🔒 Security Implementation

### File Encryption
```java
// AES-256 encryption for all uploaded files
SecretKey key = generateAESKey();
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
byte[] encryptedData = cipher.doFinal(fileData);
```

### Authentication Flow
```
User Login → Credentials Validated → JWT Generated → Token Stored
         ↓
All API Requests → JWT Validated → User Authorized → Action Performed
```

### Password Security
- Passwords hashed with BCrypt (cost factor: 10)
- Minimum 6 characters enforced
- Never stored in plain text

---

## 🧪 Testing

### Manual Testing Checklist
- ✅ User signup with validation
- ✅ User login with correct/incorrect credentials
- ✅ File upload (various formats: PDF, images, text)
- ✅ File download and decryption
- ✅ File deletion with confirmation
- ✅ File sharing with registered/unregistered emails
- ✅ Search functionality across all views
- ✅ Navigation between Dashboard, My Documents, Shared
- ✅ Token persistence across page refreshes
- ✅ Logout functionality

### Test Credentials
```
Email: test@example.com
Password: password123
```

---

## 🚦 Getting Started (Detailed)

### Step 1: MongoDB Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Free tier)
3. Set up database access:
   - Create a database user
   - Save the username and password
4. Configure network access:
   - Add IP: `0.0.0.0/0` (allow from anywhere for development)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

### Step 2: Configure Backend

Edit `backend/src/main/resources/application.properties`:
```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/minigoogledrive
spring.data.mongodb.database=minigoogledrive

# Server Configuration
server.port=8080

# File Upload Settings
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# JWT Configuration
jwt.secret=your-super-secret-key-min-256-bits-long-change-in-production
jwt.expiration=86400000

# Logging
logging.level.org.springframework.data.mongodb=DEBUG
```

### Step 3: Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

✅ Backend should start on `http://localhost:8080`

### Step 4: Run Frontend
```bash
cd frontend
npm install
npm start
```

✅ Frontend should open on `http://localhost:3000`

---

## 🎯 Usage Guide

### Creating Your First Account
1. Navigate to `http://localhost:3000/signup`
2. Fill in your details
3. Click "Sign Up"
4. You'll be redirected to login page
5. Login with your credentials

### Uploading Files
1. Click the floating **+** button (bottom right)
2. Select a file from your computer
3. File is automatically encrypted and uploaded
4. View your file in the dashboard

### Sharing Files
1. Click the **3 dots** menu on any file
2. Select **"Share"**
3. Enter recipient's email address
4. Click **"Share"**
5. File is now accessible to the recipient

### Viewing Shared Files
1. Click **"Shared with me"** in the sidebar
2. View all files shared with you
3. Open, download, or manage shared files

---

## 🔮 Future Enhancements

### Planned Features
- 🤖 **AI Semantic Search**: Natural language queries using OpenAI API
- ☁️ **AWS S3 Integration**: Scalable cloud storage
- 📱 **Mobile App**: Native iOS/Android applications
- 📊 **Analytics Dashboard**: Usage statistics and insights
- 🔔 **Real-time Notifications**: Push notifications for shares and uploads
- 👥 **Team Workspaces**: Collaborative folders
- 🏷️ **Smart Tagging**: Auto-categorization with ML
- 📝 **Version Control**: Document version history
- 🎨 **Themes**: Light/dark mode support

---

## 📈 Project Statistics

- **Lines of Code**: ~2,500+
- **Components**: 15+
- **API Endpoints**: 8
- **Development Time**: 50+ hours
- **Technologies**: 10+

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star!

**Built with ❤️ using Java, Spring Boot, React, and MongoDB**

![Made with Love](https://img.shields.io/badge/Made%20with-Love-red?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green?style=for-the-badge)

</div>
