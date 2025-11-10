# 🚀 Mini Google Drive - Smart Document Management System

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)]()
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)]()
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![AWS](https://img.shields.io/badge/AWS_S3-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)]()
[![Material UI](https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)]()

> A modern, secure cloud-based document management system with file encryption, AWS S3 storage, and seamless sharing capabilities.

---

## 🌟 Overview

**Mini Google Drive** is a full-stack document management system that revolutionizes how users store, organize, and retrieve files. Built with enterprise-grade security, cloud storage, and modern design principles, it provides a seamless experience for managing documents in the cloud.

### 💡 Why This Project?

Modern businesses and individuals face significant challenges with document management:
- **2 hours/day** wasted searching for documents
- **46%** of workers struggle to find needed files
- Growing need for **secure, encrypted cloud storage**
- Demand for **intelligent search** beyond simple keywords

Our solution addresses these challenges with cutting-edge technology and intuitive design.

---

## ✨ Features

### 🔐 Security & Authentication
- **JWT-based Authentication**: Secure login/signup with token-based sessions
- **AES-256 Encryption**: All files encrypted before cloud upload
- **Password Protection**: BCrypt hashing for user credentials
- **Secure API Endpoints**: Protected routes with authentication middleware
- **Cloud Storage**: Files stored securely in AWS S3
- **Encrypted at Rest**: All files encrypted before upload to S3

### 📤 File Management
- **Upload & Storage**: Drag-and-drop file upload with real-time progress
- **Cloud Storage**: Automatic upload to AWS S3 with encryption
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
| **AWS SDK for Java** | S3 cloud storage integration |
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
| **AWS S3** | Scalable cloud storage for encrypted files |

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
✅ AWS Account with S3 bucket (free tier)
✅ Git
```

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Richa-04/Mini-Google-Drive-Dropbox.git
cd Mini-Google-Drive-Dropbox
```

#### 2️⃣ MongoDB Setup

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

#### 3️⃣ AWS S3 Setup

1. Create a free AWS account at [AWS](https://aws.amazon.com/)
2. Navigate to **S3** service in AWS Console
3. **Create S3 Bucket:**
   - Click "Create bucket"
   - Bucket name: `your-unique-bucket-name` (must be globally unique)
   - Region: Choose closest to you (e.g., `us-west-1`)
   - Keep default settings for Block Public Access
   - Click "Create bucket"

4. **Create IAM User:**
   - Go to **IAM** → **Users** → **Create user**
   - Username: `minigoogledrive-user`
   - Click "Next"
   - Select **"Attach policies directly"**
   - Search and select: `AmazonS3FullAccess`
   - Click "Next" → "Create user"

5. **Create Access Keys:**
   - Click on the newly created user
   - Go to **"Security credentials"** tab
   - Scroll to **"Access keys"** section
   - Click **"Create access key"**
   - Choose **"Application running outside AWS"**
   - Click "Next" → "Create access key"
   - **⚠️ IMPORTANT: Save both keys immediately:**
     - **Access Key ID** (starts with AKIA...)
     - **Secret Access Key** (long random string)
   - Download the CSV file as backup
   - **You won't be able to see the Secret Access Key again!**

#### 4️⃣ Backend Configuration

Edit `backend/src/main/resources/application.properties`:
```properties
# Application Name
spring.application.name=googledrive

# MongoDB Configuration
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/minigoogledrive
spring.data.mongodb.database=minigoogledrive

# AWS S3 Configuration
aws.access.key.id=YOUR_ACCESS_KEY_ID
aws.secret.access.key=YOUR_SECRET_ACCESS_KEY
aws.s3.bucket.name=your-bucket-name
aws.s3.region=us-west-1

# Server Configuration
server.port=8080

# File Upload Settings
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# JWT Configuration
jwt.secret=your-super-secret-key-min-256-bits-long-change-in-production
jwt.expiration=86400000

# File Encryption (AES-256 requires 32 characters)
file.encryption.key=MySecretEncryptionKey1234567890

# Logging
logging.level.org.springframework.data.mongodb=DEBUG
```

**⚠️ Security Note:** Never commit your `application.properties` with real credentials to GitHub! Add it to `.gitignore`.

#### 5️⃣ Build and Run Backend
```bash
# Navigate to backend
cd backend

# Build and run
mvn clean install
mvn spring-boot:run
```

**Backend runs on:** `http://localhost:8080`

✅ You should see: `Started GoogledriveApplication in X seconds`

#### 6️⃣ Frontend Setup
```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend runs on:** `http://localhost:3000`

✅ Browser should automatically open to the login page

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
    │   MongoDB    │  │    AWS S3    │
    │  (Metadata)  │  │  (Encrypted) │
    └──────────────┘  └──────────────┘
```

### Data Flow

**File Upload Process:**
1. User selects file → Frontend validates
2. File sent to Spring Boot API with JWT token
3. Backend generates AES-256 encryption key
4. File encrypted using AES-256 algorithm
5. **Encrypted file uploaded to AWS S3**
6. Metadata (filename, owner, S3 key, encryption key) saved to MongoDB
7. Success response sent to frontend

**File Retrieval Process:**
1. User requests file → JWT validated
2. Backend fetches metadata from MongoDB
3. **Encrypted file downloaded from AWS S3**
4. File decrypted using stored encryption key
5. Decrypted file sent to user

**File Deletion Process:**
1. User requests deletion → JWT validated
2. Backend verifies ownership
3. **File deleted from AWS S3**
4. Metadata removed from MongoDB
5. Success confirmation sent to user

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

Response: 
{
  "token": "jwt_token_here",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 
{
  "token": "jwt_token_here",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### File Management Endpoints

All file endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

#### Upload File
```http
POST /api/files/upload
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

Body: file (multipart)

Response: FileMetadata object
```

#### Get All Files
```http
GET /api/files
Authorization: Bearer <jwt_token>

Response: Array of FileMetadata objects
```

#### Download File
```http
GET /api/files/download/{fileId}
Authorization: Bearer <jwt_token>

Response: Decrypted file bytes
```

#### Delete File
```http
DELETE /api/files/{fileId}
Authorization: Bearer <jwt_token>

Response: Success message
```

#### Share File
```http
POST /api/files/share
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "fileId": "file_id_here",
  "shareWithEmail": "recipient@example.com"
}

Response: Updated FileMetadata object
```

---

## 📂 Project Structure
```
Mini-Google-Drive-Dropbox/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/project/googledrive/
│   │   │   │   ├── config/          # Security, CORS, S3 configuration
│   │   │   │   ├── controller/      # REST API endpoints
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── model/           # Entity classes (User, FileMetadata)
│   │   │   │   ├── repository/      # MongoDB repositories
│   │   │   │   ├── security/        # JWT utilities, filters
│   │   │   │   ├── service/         # Business logic (Auth, File)
│   │   │   │   └── util/            # Encryption utilities
│   │   │   └── resources/
│   │   │       └── application.properties  # Configuration
│   │   └── test/                    # Unit tests
│   ├── uploads/                     # (Deprecated - now using AWS S3)
│   └── pom.xml                      # Maven dependencies
│
├── frontend/
│   ├── public/
│   │   ├── index.html               # HTML template
│   │   ├── favicon.ico              # Browser icon
│   │   └── logo192.png              # App icon
│   ├── src/
│   │   ├── assets/                  # Images, logos
│   │   │   └── logo.png
│   │   ├── components/              # React components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/                 # Auth context
│   │   │   └── AuthContext.jsx
│   │   ├── services/                # API calls
│   │   │   └── api.js
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # Entry point
│   ├── package.json                 # npm dependencies
│   └── .gitignore
│
├── .gitignore
└── README.md
```

---

## 🔒 Security Implementation

### File Encryption (AES-256)
```java
// All uploaded files are encrypted before cloud storage
SecretKey key = generateAESKey();
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
GCMParameterSpec parameterSpec = new GCMParameterSpec(128, iv);
cipher.init(Cipher.ENCRYPT_MODE, key, parameterSpec);
byte[] encryptedData = cipher.doFinal(fileData);

// Encrypted data uploaded to AWS S3
amazonS3.putObject(bucketName, fileName, encryptedStream, metadata);
```

### Authentication Flow
```
User Login → Credentials Validated → JWT Generated → Token Stored
         ↓
All API Requests → JWT Validated → User Authorized → Action Performed
         ↓
File Operations → Ownership Verified → AWS S3 Access → Response
```

### Password Security
- Passwords hashed with **BCrypt** (cost factor: 10)
- Minimum **6 characters** enforced
- Never stored in plain text
- Secure comparison using BCrypt matcher

### AWS S3 Security
- All files **encrypted before upload** (AES-256)
- IAM user with **restricted permissions**
- Encryption keys stored **separately** in MongoDB
- **No direct public access** to S3 bucket
- Files accessible only through authenticated API

---

## 🧪 Testing

### Manual Testing Checklist
- ✅ User signup with validation
- ✅ User login with correct/incorrect credentials
- ✅ Duplicate email detection with proper error message
- ✅ File upload to AWS S3 (various formats: PDF, images, text)
- ✅ File download and decryption from S3
- ✅ File deletion from S3 and MongoDB
- ✅ File sharing with registered/unregistered emails
- ✅ Search functionality across all views
- ✅ Navigation between Dashboard, My Documents, Shared
- ✅ Token persistence across page refreshes
- ✅ Logout functionality
- ✅ Storage analytics display
- ✅ Responsive design on mobile/tablet

### Test Credentials
```
Email: test@example.com
Password: password123
```

---

## 🎯 Usage Guide

### Creating Your First Account
1. Navigate to `http://localhost:3000/signup`
2. Fill in your details (First Name, Last Name, Email, Password)
3. Click "Sign Up"
4. You'll be redirected to login page
5. Login with your credentials

### Uploading Files
1. Click the floating **+** button (bottom right)
2. Select a file from your computer
3. File is automatically:
   - Encrypted with AES-256
   - Uploaded to AWS S3
   - Metadata saved to MongoDB
4. View your file in the dashboard immediately

### Sharing Files
1. Click the **3 dots** menu on any file
2. Select **"Share"**
3. Enter recipient's email address
4. Click **"Share"**
5. Recipient can now access the file in their "Shared with me" section

### Viewing Shared Files
1. Click **"Shared with me"** in the sidebar
2. View all files others have shared with you
3. Open, download, or manage shared files
4. Shared files are clearly labeled

### Searching for Files
1. Use the search bar at the top
2. Type filename or keywords
3. Results filter in real-time
4. Search works across all views (Dashboard, My Documents, Shared)

---

## 🔮 Future Enhancements

### Planned Features
- 🤖 **AI Semantic Search**: Natural language queries using OpenAI API
- 📱 **Mobile App**: Native iOS/Android applications
- 📊 **Analytics Dashboard**: Usage statistics and insights
- 🔔 **Real-time Notifications**: Push notifications for shares and uploads
- 👥 **Team Workspaces**: Collaborative folders
- 🏷️ **Smart Tagging**: Auto-categorization with ML
- 📝 **Version Control**: Document version history
- 🎨 **Themes**: Light/dark mode support
- 📧 **Email Notifications**: Share confirmations and updates
- 🔄 **Automatic Backup**: Scheduled backups to secondary storage
- 📈 **Usage Reports**: Detailed analytics for admin users

---

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check if port 8080 is already in use
lsof -i :8080

# Kill the process
kill -9 <PID>

# Clean and rebuild
mvn clean install
```

#### Frontend connection error
- Verify backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Clear browser cache and cookies

#### MongoDB connection error
- Verify connection string in `application.properties`
- Check network access settings in MongoDB Atlas
- Ensure IP `0.0.0.0/0` is allowed

#### AWS S3 upload fails
- Verify AWS credentials in `application.properties`
- Check IAM user has `AmazonS3FullAccess` policy
- Ensure bucket name and region are correct
- Check AWS account is not suspended

#### File download shows encrypted data
- Verify encryption key in `application.properties` is correct
- Check FileService decryption logic
- Ensure metadata in MongoDB has correct encryption key

---

## 📈 Project Statistics

- **Lines of Code**: ~3,000+
- **Components**: 15+
- **API Endpoints**: 10+
- **Development Time**: 60+ hours
- **Technologies**: 12+
- **Cloud Services**: AWS S3, MongoDB Atlas

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👥 Authors

- **Richa Padhariya** - [GitHub](https://github.com/Richa-04)

---

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- MongoDB Atlas
- AWS S3 Documentation
- Material-UI Component Library
- Stack Overflow Community

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star!

**Built with ❤️ using Java, Spring Boot, React, MongoDB, and AWS S3**

![Made with Love](https://img.shields.io/badge/Made%20with-Love-red?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green?style=for-the-badge)
![AWS](https://img.shields.io/badge/Cloud-AWS_S3-orange?style=for-the-badge)

---

**🚀 Happy Coding!**

</div>
