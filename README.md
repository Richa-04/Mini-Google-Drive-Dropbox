# 🚀 Mini Google Drive - Smart Document Management System

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)]()
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)]()
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![AWS](https://img.shields.io/badge/AWS_S3-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)]()
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)]()
[![Material UI](https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)]()

> A modern, secure cloud-based document management system with AI-powered semantic search, file encryption, AWS S3 storage, and seamless collaboration.

---

## 🌟 Overview

**Mini Google Drive** is a full-stack document management system that revolutionizes how users store, organize, and retrieve files. Built with enterprise-grade security, AI-powered search, cloud storage, and modern design principles, it provides a seamless experience for managing documents in the cloud.

### 💡 Why This Project?

Modern businesses and individuals face significant challenges with document management:
- **2 hours/day** wasted searching for documents
- **46%** of workers struggle to find needed files
- Growing need for **secure, encrypted cloud storage**
- Demand for **intelligent search** beyond simple keywords

Our solution addresses these challenges with cutting-edge technology, AI-powered semantic search, and intuitive design.

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
- **Upload & Storage**: File upload with real-time progress
- **Cloud Storage**: Automatic upload to AWS S3 with encryption
- **Download & Preview**: View files directly in browser or download
- **Rename Files**: Easily rename files without re-uploading
- **Delete Operations**: Secure file deletion with confirmation
- **File Organization**: Smart categorization and sorting

### 🤝 Collaboration
- **File Sharing**: Share files with multiple users via email
- **Access Control**: Owner-based permissions system
- **Shared Files View**: Dedicated section for files shared with you
- **Duplicate Share Prevention**: Prevents sharing same file with same email twice

### 🤖 AI-Powered Search & Discovery
- **Dual Search Modes**: 
  - **Basic Search**: Real-time keyword filtering as you type
  - **AI Semantic Search**: Intelligent document discovery using OpenAI embeddings
- **High Precision**: 78% similarity threshold for relevant results
- **Top Results**: Returns top 3 most relevant documents
- **Natural Language**: Search with phrases like "project ideas" or "budget reports"
- **Smart Toggle**: Easy switch between Basic ↔ AI modes

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop
- **Smooth Animations**: Polished hover effects and transitions
- **File Type Icons**: Visual indicators for PDFs, images, documents
- **Storage Analytics**: Real-time storage usage tracking
- **Grid & List Views**: Toggle between grid and list display modes
- **Advanced Filters**: Filter by file type (PDF, Images, Documents), date (Today, Week, Month), and sort options

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
| **React Context API** | State management (Auth, Files) |

### Database & Storage
| Technology | Purpose |
|------------|---------|
| **MongoDB Atlas** | NoSQL database for metadata & embeddings |
| **AWS S3** | Scalable cloud storage for encrypted files |

### AI & Machine Learning
| Technology | Purpose |
|------------|---------|
| **OpenAI API** | Semantic document search |
| **text-embedding-ada-002** | Document & query embedding generation |
| **Vector Similarity** | Cosine similarity with 78% threshold |

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
✅ Maven 3.6+ (for building the backend)
✅ Node.js 16+ and npm
✅ MongoDB Atlas account (free tier)
✅ AWS Account with S3 bucket (free tier)
✅ OpenAI API Key (for AI semantic search)
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
   - Region: Choose closest to you (e.g., `us-east-1`)
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

#### 4️⃣ OpenAI API Setup

1. Create a free account at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to **API Keys** in your dashboard
3. Click **"Create new secret key"**
4. **Name it**: `Mini-Google-Drive`
5. **⚠️ IMPORTANT: Copy the key immediately** (starts with `sk-...`)
6. **Billing Setup** (Required):
   - Go to Settings → Billing
   - Add payment method (credit card)

**Pricing:**
- text-embedding-ada-002: ~$0.0001 per 1K tokens
- Average document embedding: ~$0.00005
- Average search query: ~$0.00001 (extremely cheap!)
- Expected cost: $0.10-0.50/month for normal usage

**✅ Verify OpenAI Setup:**
- API key starts with `sk-proj-` or `sk-`
- Billing method added and active
- Usage limits set (optional but recommended)

#### 5️⃣ Backend Configuration

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
aws.s3.region=us-east-1

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

# OpenAI Configuration (for AI Semantic Search)
openai.api.key=YOUR_OPENAI_API_KEY
openai.model=text-embedding-ada-002

# Logging (Optional - for debugging)
logging.level.org.springframework.data.mongodb=DEBUG
```

**⚠️ Security Note:** 
- Never commit your `application.properties` with real credentials to GitHub! 
- Add it to `.gitignore`:
  ```bash
  # In backend/.gitignore
  src/main/resources/application.properties
  ```
- For production deployment, use environment variables or AWS Secrets Manager
- Generate a strong JWT secret (32+ random characters)
- Keep your encryption key secure (exactly 32 characters for AES-256)

#### 6️⃣ Build and Run Backend
```bash
# Navigate to backend
cd backend

# Build and run
mvn clean install
mvn spring-boot:run
```

**Backend runs on:** `http://localhost:8080`

✅ You should see: `Started GoogledriveApplication in X seconds`

#### 7️⃣ Frontend Setup
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
3. **AI Search**: Toggle to AI mode and search with natural language like "project ideas"
4. **Manage Files**: Open, download, share, or delete files from the dashboard
5. **Share Files**: Click 3 dots → Share → Enter recipient's email
6. **Search**: Use the search bar to find files instantly

---

## 🏗️ System Architecture
```
┌───────────────────────────────────────────────────────────┐
│                        Frontend (React)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │  Signup  │  │Dashboard │  │AI Search │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────┬─────────────────────────────────┘
                          │ REST API (Axios)
                          ▼
┌────────────────────────────────────────────────────────────┐
│                   Backend (Spring Boot)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Service │  │ File Service │  │AI Search Svc │      │
│  │    (JWT)     │  │ (Encryption) │  │ (Embeddings) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────┬─────────────────┬─────────────────┬────────────┘
            │                 │                 │
            ▼                 ▼                 ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   MongoDB    │  │    AWS S3    │  │   OpenAI     │
    │  (Metadata)  │  │  (Encrypted) │  │ (Embeddings) │
    │ +Embeddings  │  │    Files     │  │   ada-002    │
    └──────────────┘  └──────────────┘  └──────────────┘
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

**AI Search Process:**
1. User enters query in AI mode → Press Enter
2. **OpenAI generates query embedding** (1536-dimensional vector)
3. Compare with file embeddings stored in MongoDB
4. Calculate cosine similarity scores
5. Filter results with >78% similarity threshold
6. Return top 3 most relevant documents
7. Display results instantly

---

## 🤖 AI-Powered Search

### How It Works

**Basic Search Mode:**
1. Type filename → Filters instantly as you type
2. Shows files matching the text in filename
3. Fast and simple keyword matching

**AI Search Mode:**
1. Type natural language query (e.g., "project ideas", "budget documents")
2. Press Enter or click search icon
3. **OpenAI text-embedding-ada-002** generates semantic embeddings for your query
4. Compares with pre-indexed file embeddings stored in MongoDB
5. Calculates cosine similarity between vectors
6. Returns top 3 files with >78% similarity match
7. High precision, low noise results!

### AI Search Architecture

```
User Query: "project ideas"
         ↓
    OpenAI API (text-embedding-ada-002)
         ↓
   Generate Query Embedding (1536-dimensional vector)
         ↓
Compare with File Embeddings (MongoDB)
         ↓
Calculate Cosine Similarity
         ↓
   Filter: Similarity > 78%
         ↓
   Sort by Similarity Score
         ↓
   Return Top 3 Results
         ↓
  Display in Dashboard
```

### Technical Details

**Embedding Model:** text-embedding-ada-002
- **Dimensions:** 1536-dimensional vectors
- **Context Length:** Up to 8,191 tokens
- **Similarity Metric:** Cosine similarity
- **Threshold:** 78% for high precision
- **Cost:** ~$0.0001 per 1K tokens (very economical)

### Example Queries

| Query | Finds |
|-------|-------|
| "project ideas" | Project proposals, brainstorming docs |
| "budget report" | Financial documents, expense sheets |
| "meeting notes" | Minutes, discussion summaries |
| "python tutorial" | Code guides, learning materials |
| "design mockup" | UI/UX files, wireframes |

### Performance
- **Accuracy**: 78%+ similarity threshold ensures high relevance
- **Speed**: ~1-2 seconds per search (includes API call)
- **Cost**: ~$0.00001 per search query (extremely economical)
- **Embedding Generation**: ~200-300ms per document

---

## ⚡ Performance Optimizations

### Client-Side State Management
Our application implements intelligent state management to provide a seamless user experience:

**Dual-State Architecture:**
```javascript
// Maintains two separate states for optimal performance
const [allFiles, setAllFiles] = useState([]); // Complete file list
const [files, setFiles] = useState([]);       // Filtered display files
```

**Benefits:**
- ✅ **Zero Unnecessary Reloads**: Operations update state directly without server calls
- ✅ **Instant UI Updates**: Files appear/disappear immediately
- ✅ **Smooth Search**: Switching between search modes doesn't reload files
- ✅ **Better UX**: No loading spinners for simple operations

### Operation-Specific Optimizations

#### File Upload
```javascript
// Adds new file to state instead of reloading all files
setFiles(prevFiles => [newFile, ...prevFiles]);
```

#### File Deletion
```javascript
// Removes specific file from state
setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
```

#### File Rename
```javascript
// Updates only the renamed file in state
setFiles(prevFiles => prevFiles.map(file => 
    file.id === renamedFileId ? { ...file, originalFileName: newName } : file
));
```

#### File Sharing
```javascript
// Updates sharedWith array for specific file only
setFiles(prevFiles => prevFiles.map(file => 
    file.id === sharedFileId 
        ? { ...file, sharedWith: [...file.sharedWith, newEmail] }
        : file
));
```

**Result**: Operations complete in **<100ms** vs traditional reload approach taking **1-2 seconds**.

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

#### AI Semantic Search
```http
GET /api/files/search/ai?query={searchQuery}
Authorization: Bearer <jwt_token>

Example: /api/files/search/ai?query=project%20ideas

Response: Array of top 3 FileMetadata objects with > 78% similarity
```

#### Download File
```http
GET /api/files/download/{fileId}
Authorization: Bearer <jwt_token>

Response: Decrypted file bytes
```

#### Rename File
```http
PUT /api/files/rename/{fileId}?newFileName={newName}
Authorization: Bearer <jwt_token>

Response: Success message
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
│   │   │   │   ├── service/         # Business logic (Auth, File, AI Search)
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
- ✅ File rename with real-time update
- ✅ File sharing with registered/unregistered emails
- ✅ Duplicate share prevention (same file to same email)
- ✅ AI search with natural language queries
- ✅ AI/Basic search mode toggle
- ✅ AI search returns relevant top 3 results
- ✅ AI search loading indicator
- ✅ Search functionality across all views (Basic mode)
- ✅ Grid/List view toggle with persistence
- ✅ Advanced filters (file type, date, sorting)
- ✅ Logout functionality
- ✅ Storage analytics display
- ✅ Responsive design on mobile/tablet

### Test Credentials
```
Email: test@example.com
Password: password123
```

To test the application with sample documents, download our files:

**[Download Sample Files](https://drive.google.com/drive/folders/19PXVXss8RezgyWTsjAjBFI-oG0lVUZnu?usp=sharing)** 📥

**Includes:**
- 📄 PDF documents (reports, presentations)
- 🖼️ Images (JPG, PNG formats)
- 📝 Text files (TXT)

---

## 🎯 Usage Guide

### Creating Your First Account
1. Navigate to `http://localhost:3000/signup`
2. Fill in your details (First Name, Last Name, Email, Password)
3. Click "Sign Up"
4. You'll be redirected to login page
5. Login with your credentials

### File Handling

1. **Upload**: Click the floating + button, choose a file — it's auto-encrypted (AES-256), uploaded to AWS S3, and logged in MongoDB.
2. **AI Search**: Toggle to AI mode, type natural language queries like "project ideas", press Enter
3. **Basic Search**: Type filename in Basic mode for instant keyword filtering
4. **Share**: Hit ⋮ → Share, enter an email, and your file appears in their "Shared with me" tab
5. **View Shared Files**: Access "Shared with me" to open, download, or manage incoming files
6. **Rename**: Click ⋮ → Rename, edit, and save — updates everywhere in real time
7. **Delete**: Click ⋮ → Delete, confirm — file removed from AWS S3 and MongoDB instantly

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

#### OpenAI API errors
- Verify API key is correct and active
- Check billing method is added in OpenAI account
- Ensure usage limits not exceeded
- Verify `text-embedding-ada-002` model is available

#### File download shows encrypted data
- Verify encryption key in `application.properties` is correct
- Check FileService decryption logic
- Ensure metadata in MongoDB has correct encryption key

#### Files keep reloading/refreshing
- This should not happen with the current implementation
- If you experience this, check browser console for errors
- Verify `allFiles` state is properly initialized
- Ensure no duplicate `useEffect` calls with `loadFiles()`

#### Sharing same file with same email
- Application now prevents duplicate shares
- Error message displayed: "File is already shared with [email]!"
- No server call made for duplicate shares

#### AI search not working
- Verify OpenAI API key is configured correctly
- Check if billing is set up in OpenAI account
- Ensure backend logs don't show API errors
- Try Basic search mode to verify file retrieval works

---

## 📈 Project Statistics

- **Lines of Code**: ~4,000+
- **Components**: 15+
- **API Endpoints**: 11+ (including AI search)
- **Development Time**: 80+ hours
- **Technologies**: 14+ (including OpenAI)
- **Cloud Services**: AWS S3, MongoDB Atlas, OpenAI Platform
- **AI Features**: Semantic search with 78% precision threshold
- **Performance**: <100ms operation response, 1-2s AI search
- **Zero Unnecessary API Calls**: Smart state management

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star!

**Built with ❤️ using Java, Spring Boot, React, MongoDB, AWS S3, and OpenAI**

![Made with Love](https://img.shields.io/badge/Made%20with-Love-red?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green?style=for-the-badge)
![AWS](https://img.shields.io/badge/Cloud-AWS_S3-orange?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge)

---

**🚀 Happy Coding!**

</div>