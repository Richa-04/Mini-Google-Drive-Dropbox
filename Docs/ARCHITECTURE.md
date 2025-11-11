# 🏗️ System Architecture

This document provides a comprehensive overview of Mini Google Drive's architecture, component interactions, and design decisions.

---

## 📊 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                     │
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Login    │  │   Signup   │  │ Dashboard  │            │
│  │   Page     │  │    Page    │  │  (Main UI) │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         React 18 + Material-UI + React Router                │
└───────────────────────────┬──────────────────────────────────┘
                            │
                    REST API (HTTPS)
                    JWT Authentication
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  Application Layer (Backend)                  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Spring Boot Application                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │   Auth   │  │   File   │  │   NLP    │           │   │
│  │  │ Service  │  │ Service  │  │ Services │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │Security  │  │Encryption│  │  OpenAI  │           │   │
│  │  │ Filter   │  │  Utils   │  │ Service  │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └──────────────────────────────────────────────────────┘   │
│                    Java 17 + Spring Boot 3.5.7               │
└────┬────────────────┬─────────────────┬─────────────────────┘
     │                │                 │
     │                │                 │
     ▼                ▼                 ▼
┌─────────┐    ┌──────────┐    ┌─────────────┐
│ MongoDB │    │  AWS S3  │    │   OpenAI    │
│  Atlas  │    │          │    │     API     │
│         │    │          │    │             │
│Metadata │    │Encrypted │    │ GPT-3.5 +   │
│Keywords │    │  Files   │    │  ada-002    │
│Summary  │    │          │    │             │
│Embedding│    │          │    │             │
└─────────┘    └──────────┘    └─────────────┘
```

---

## 🔄 Data Flow Diagrams

### File Upload Flow with NLP

```
User Action: Click + → Select PDF
         ↓
Frontend Validation (size, type)
         ↓
POST /api/files/upload (with JWT token)
         ↓
┌─────────────────────────────────────────┐
│         Backend Processing              │
│                                          │
│  1. Validate JWT Token                  │
│  2. Check Storage Limit (15GB)          │
│  3. Generate Encryption Key (AES-256)   │
│  4. Encrypt File Data                   │
│  5. Upload to S3 (encrypted)            │
│  6. ✨ Extract Text (Apache Tika)       │
│  7. ✨ Generate Keywords (GPT-3.5)      │
│  8. ✨ Create Summary (GPT-3.5)         │
│  9. ✨ Generate Embedding (ada-002)     │
│ 10. Save Metadata to MongoDB            │
└─────────────────────────────────────────┘
         ↓
Return FileMetadata with keywords, summary, embedding
         ↓
Frontend Updates State (no reload)
         ↓
File Appears with Expand Button
```

**Processing Time:**
- File encryption & S3 upload: ~500ms
- NLP processing (Tika + OpenAI): ~2-3s
- Total: ~3-4s for complete upload with AI analysis

---

### AI Semantic Search Flow

```
User: Types "project ideas" in AI mode → Press Enter
         ↓
Frontend: GET /api/files/search/ai?query=project+ideas
         ↓
┌─────────────────────────────────────────┐
│         Backend Processing              │
│                                          │
│  1. Validate JWT Token                  │
│  2. ✨ Generate Query Embedding         │
│     OpenAI ada-002("project ideas")     │
│     → [0.245, -0.432, ... 1536 nums]    │
│                                          │
│  3. Fetch All User's Files from MongoDB │
│                                          │
│  4. ✨ Calculate Similarity Scores      │
│     For each file:                      │
│       score = cosineSimilarity(         │
│         queryEmbedding,                 │
│         file.embedding                  │
│       )                                 │
│                                          │
│  5. Filter: score > 0.78 (78%)          │
│                                          │
│  6. Sort by Score (highest first)       │
│                                          │
│  7. Return Top 3 Results                │
└─────────────────────────────────────────┘
         ↓
Return: [
  {file: "Project_Proposal.pdf", score: 0.87},
  {file: "Brainstorming_Doc.pdf", score: 0.82},
  {file: "Innovation_Ideas.txt", score: 0.79}
]
         ↓
Frontend Displays Results
```

**Search Time:** ~1-2 seconds (includes OpenAI API call)

---

### Authentication Flow

```
User Enters Credentials
         ↓
POST /api/auth/login
         ↓
┌─────────────────────────────────────────┐
│  1. Find User in MongoDB                │
│  2. BCrypt Compare (password hash)      │
│  3. If valid: Generate JWT Token        │
│     - Payload: email, firstName         │
│     - Expiration: 24 hours              │
│     - Signed with secret key            │
└─────────────────────────────────────────┘
         ↓
Return: { token: "eyJhbGc...", user: {...} }
         ↓
Frontend Stores Token in localStorage
         ↓
All Future Requests Include:
Authorization: Bearer eyJhbGc...
         ↓
Security Filter Validates Token on Every Request
```

---

## 🗂️ Component Architecture

### Backend Components

```
┌─────────────────────────────────────────────────────┐
│                   Controllers                        │
│  ┌──────────────┐  ┌──────────────┐                │
│  │AuthController│  │FileController│                │
│  │ /api/auth/*  │  │ /api/files/* │                │
│  └──────┬───────┘  └──────┬───────┘                │
│         │                 │                          │
│         ▼                 ▼                          │
│  ┌──────────────┐  ┌──────────────────────────┐    │
│  │AuthService   │  │   FileService            │    │
│  │- signup()    │  │   - uploadFile()         │    │
│  │- login()     │  │   - downloadFile()       │    │
│  └──────────────┘  │   - deleteFile()         │    │
│                    │   - shareFile()          │    │
│                    └──────┬───────────────────┘    │
│                           │                         │
│         ┌─────────────────┼─────────────────┐      │
│         ▼                 ▼                 ▼       │
│  ┌────────────┐  ┌─────────────┐  ┌──────────┐    │
│  │  OpenAI    │  │  Keyword    │  │ Summary  │    │
│  │  Service   │  │ Extraction  │  │ Service  │    │
│  │            │  │  Service    │  │          │    │
│  └────────────┘  └─────────────┘  └──────────┘    │
│         │                 │                 │       │
│         └─────────────────┴─────────────────┘      │
│                           │                         │
│                    NLP Processing                   │
└─────────────────────────────────────────────────────┘
```

### Frontend Components

```
App.js (Router)
  │
  ├── AuthContext (Global Auth State)
  │
  ├── Login.jsx
  │     └── Calls: /api/auth/login
  │
  ├── Signup.jsx
  │     └── Calls: /api/auth/signup
  │
  └── Dashboard.jsx (Main UI)
        │
        ├── State Management
        │   ├── files (display files)
        │   ├── allFiles (complete list)
        │   ├── expandedFiles (UI state)
        │   └── searchMode (AI/Basic)
        │
        ├── File Operations
        │   ├── Upload → /api/files/upload
        │   ├── Download → /api/files/download/{id}
        │   ├── Delete → /api/files/{id}
        │   ├── Rename → /api/files/rename/{id}
        │   └── Share → /api/files/share
        │
        └── Search
            ├── Basic → Filter in frontend
            └── AI → /api/files/search/ai?query=
```

---

## 💾 Data Models

### User Model (MongoDB)
```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "password": "$2a$10$hashedPassword...",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2025-11-11T10:00:00Z"
}
```

### FileMetadata Model (MongoDB)
```json
{
  "_id": "673abc123def...",
  "fileName": "uuid_document.pdf",
  "originalFileName": "AI_Research_Paper.pdf",
  "fileType": "application/pdf",
  "fileSize": 523700,
  "filePath": "s3://bucket/uuid_document.pdf",
  "ownerEmail": "user@example.com",
  "uploadedAt": "2025-11-11T11:20:00Z",
  "encryptionKey": "base64EncodedKey==",
  "sharedWith": ["colleague@example.com"],
  "embedding": [0.234, -0.456, 0.789, ... 1536 numbers],
  "keywords": [
    "Artificial Intelligence",
    "Machine Learning", 
    "Deep Learning",
    "Natural Language Processing"
  ],
  "summary": "This paper examines AI and machine learning techniques for natural language processing tasks, focusing on deep learning models and their applications in real-world scenarios."
}
```

**Field Purposes:**
- `fileName`: S3 object key (UUID-based, unique)
- `originalFileName`: User-facing name (editable)
- `encryptionKey`: AES-256 key for decryption
- `embedding`: Vector for semantic search
- `keywords`: NLP-extracted topics
- `summary`: AI-generated overview

---

## 🔐 Security Architecture

### Encryption Flow

**Upload (Encryption):**
```
Plain File (user's computer)
         ↓
AES-256-GCM Encryption (backend)
  Key: Random 32-byte key
  IV: Random 16-byte IV
  Algorithm: AES/GCM/NoPadding
         ↓
Encrypted File → AWS S3
Encryption Key → MongoDB (separate storage)
```

**Download (Decryption):**
```
Fetch Metadata from MongoDB (get encryption key)
         ↓
Download Encrypted File from S3
         ↓
AES-256-GCM Decryption (backend)
  Using stored key from MongoDB
         ↓
Plain File → User
```

**Security Benefits:**
- ✅ Files encrypted at rest (S3)
- ✅ Keys never stored with files
- ✅ Compromised S3 = useless without keys
- ✅ Compromised MongoDB = useless without encrypted files

### Authentication & Authorization

**JWT Token Structure:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user@example.com",
    "firstName": "John",
    "iat": 1699123456,
    "exp": 1699209856
  },
  "signature": "HMACSHA256(base64(header) + base64(payload), secret)"
}
```

**Security Filter Chain:**
```
HTTP Request
     ↓
CORS Filter (validate origin)
     ↓
JWT Authentication Filter
     ↓
Extract & Validate Token
     ↓
Set Authentication Context
     ↓
Authorization Check (ownership, permissions)
     ↓
Controller Endpoint
```

---

## 🤖 NLP Pipeline Architecture

### Processing Pipeline

```
Document Upload
       ↓
┌────────────────────────────────────────┐
│ STAGE 1: Text Extraction               │
│                                         │
│ Tool: Apache Tika                      │
│ Input: Binary file (PDF/DOC)           │
│ Output: Plain text content             │
│ Time: ~200ms                            │
└──────────────────┬─────────────────────┘
                   ↓
┌────────────────────────────────────────┐
│ STAGE 2: Keyword Extraction            │
│                                         │
│ Tool: OpenAI GPT-3.5-turbo             │
│ Method: Topic modeling via prompting   │
│ Output: 5-7 relevant keywords          │
│ Time: ~800ms                            │
│ Cost: ~$0.00005 per document           │
└──────────────────┬─────────────────────┘
                   ↓
┌────────────────────────────────────────┐
│ STAGE 3: Document Summarization        │
│                                         │
│ Tool: OpenAI GPT-3.5-turbo             │
│ Method: Abstractive summarization      │
│ Output: 2-3 sentence summary           │
│ Time: ~900ms                            │
│ Cost: ~$0.00008 per document           │
└──────────────────┬─────────────────────┘
                   ↓
┌────────────────────────────────────────┐
│ STAGE 4: Embedding Generation          │
│                                         │
│ Tool: OpenAI text-embedding-ada-002    │
│ Method: Neural network encoding        │
│ Output: 1536-dimensional vector        │
│ Time: ~400ms                            │
│ Cost: ~$0.0001 per document            │
└──────────────────┬─────────────────────┘
                   ↓
            Store in MongoDB
      (text, keywords, summary, embedding)
```

**Total Processing Time:** ~2.3 seconds per document  
**Total Cost:** ~$0.00023 per document (~$0.23 per 1000 documents)

### Semantic Search Algorithm

**Vector Similarity Calculation:**

```java
public double cosineSimilarity(List<Double> vectorA, List<Double> vectorB) {
    // Dot Product
    double dotProduct = 0.0;
    for (int i = 0; i < vectorA.size(); i++) {
        dotProduct += vectorA.get(i) * vectorB.get(i);
    }
    
    // Magnitudes
    double magnitudeA = sqrt(sum(vectorA^2));
    double magnitudeB = sqrt(sum(vectorB^2));
    
    // Cosine Similarity
    return dotProduct / (magnitudeA * magnitudeB);
    // Result: 0.0 to 1.0 (1.0 = identical meaning)
}
```

**Search Process:**
1. Query "project ideas" → Embedding [0.245, -0.432, ...]
2. Compare with all file embeddings
3. Calculate similarity scores
4. Filter: Keep only scores > 0.78 (78%)
5. Sort: Highest similarity first
6. Return: Top 3 results

**Why 78% threshold?**
- Too low (50%): Many irrelevant results
- Too high (95%): Misses related documents
- **78%**: Sweet spot for precision vs recall

---

## 📁 Database Schema Design

### Collections Structure

**users collection:**
```javascript
{
  email: String (unique, indexed),
  password: String (BCrypt hashed),
  firstName: String,
  lastName: String,
  createdAt: Date
}
```

**files collection:**
```javascript
{
  fileName: String (S3 key),
  originalFileName: String,
  fileType: String,
  fileSize: Number,
  filePath: String (S3 URI),
  ownerEmail: String (indexed),
  uploadedAt: Date (indexed),
  encryptionKey: String,
  sharedWith: [String] (array of emails),
  embedding: [Number] (1536 dimensions),
  keywords: [String] (5-7 keywords),
  summary: String (2-3 sentences)
}
```

**Indexes:**
- `ownerEmail` - Fast file retrieval by user
- `uploadedAt` - Sort by date
- `sharedWith` - Find shared files efficiently

---

## ⚡ Performance Optimizations

### Frontend State Management

**Dual-State Pattern:**
```javascript
// Complete dataset
const [allFiles, setAllFiles] = useState([]);

// Display subset (filtered/searched)
const [files, setFiles] = useState([]);
```

**Benefits:**
- Search mode switch: 0 API calls (use cached data)
- Filter changes: 0 API calls (client-side filtering)
- Only reload on: Upload, delete, initial load

### Backend Optimizations

**Lazy NLP Processing:**
- Text extraction: Only for PDFs/Docs (not images)
- Embedding generation: Only if text exists
- Graceful degradation: Upload succeeds even if NLP fails

**Efficient MongoDB Queries:**
```java
// Indexed query - fast
fileRepository.findByOwnerEmail(email);

// Filtered search - only compares files with embeddings
.filter(file -> file.getEmbedding() != null)
```

---

## 🔧 Technology Decisions

### Why Spring Boot?
- ✅ Robust security framework (Spring Security)
- ✅ Easy cloud service integration (AWS SDK)
- ✅ Production-ready features (logging, monitoring)
- ✅ Large ecosystem and community

### Why MongoDB?
- ✅ Flexible schema (easy to add NLP fields)
- ✅ Handles large arrays (embeddings: 1536 numbers)
- ✅ Fast document queries
- ✅ Cloud-native with Atlas

### Why AWS S3?
- ✅ Highly scalable and durable (99.999999999%)
- ✅ Cost-effective ($0.023/GB/month)
- ✅ Industry standard
- ✅ SDK well-supported

### Why OpenAI?
- ✅ State-of-the-art NLP models
- ✅ No model training required
- ✅ Production-ready APIs
- ✅ Cost-effective for use case

### Why React + Material-UI?
- ✅ Component reusability
- ✅ Professional design system
- ✅ Responsive out-of-box
- ✅ Large community

---

## 🌐 Deployment Architecture (Future)

### Proposed Production Setup

```
┌─────────────────────────────────────────────┐
│              CDN (CloudFront)                │
│         Static React Assets                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Load Balancer (AWS ALB)              │
└──────────────────┬──────────────────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   Backend    │  │   Backend    │
│  Instance 1  │  │  Instance 2  │
│(EC2/Fargate) │  │(EC2/Fargate) │
└──────────────┘  └──────────────┘
          │                 │
          └────────┬────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   MongoDB      AWS S3     OpenAI API
    Atlas                  (External)
```

**Scalability:**
- Horizontal scaling: Add more backend instances
- S3: Automatically scales
- MongoDB Atlas: Auto-scaling available
- OpenAI: Rate limits handled with retry logic

---

## 🔄 State Management Flow

### Frontend State Updates

**Upload Operation:**
```javascript
// Traditional approach (slow)
await uploadFile() → loadFiles() → setState()
// Result: 2 API calls, visible reload

// Our approach (fast)
await uploadFile() → setFiles(prev => [newFile, ...prev])
// Result: 1 API call, instant update, no reload
```

**Delete Operation:**
```javascript
// Our optimized approach
await deleteFile(id) → setFiles(prev => prev.filter(f => f.id !== id))
// Result: Instant removal, no server roundtrip for refresh
```

**Search Mode Toggle:**
```javascript
// Switch AI ↔ Basic
setSearchMode('ai') → setFiles(allFiles)
// Result: 0 API calls, instant switch
```

---

## 📊 Scalability Considerations

### Current Capacity
- **Users:** Single user per deployment
- **Files:** Unlimited (up to 15GB per user)
- **Search:** Linear time O(n) with n files
- **Storage:** S3 auto-scales

### Scaling Strategy (Future)
- **Multi-user:** Already supported (email-based isolation)
- **Search optimization:** Add vector database (Pinecone, Weaviate)
- **Caching:** Redis for frequently accessed files
- **CDN:** CloudFront for faster file delivery
- **Database:** MongoDB sharding for large-scale

---

## 🔍 Monitoring & Observability

### Current Logging

**Backend Logs:**
```
✅ Generated embedding for: filename.pdf
✅ Extracted keywords for: filename.pdf → [...]
✅ Generated summary for: filename.pdf
```

**Frontend Logs:**
```javascript
console.log('🔄 LOADING FILES FROM SERVER');
console.log('Toggling file:', fileId);
```

### Production Monitoring (Future)
- Application metrics (Spring Boot Actuator)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- Cost tracking (AWS Cost Explorer, OpenAI usage dashboard)

---

## 🎯 Design Patterns Used

### Backend Patterns
- **Service Layer Pattern**: Business logic separated from controllers
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Spring's @Autowired, @RequiredArgsConstructor
- **Builder Pattern**: Request objects (EmbeddingRequest, ChatCompletionRequest)

### Frontend Patterns
- **Context API**: Global authentication state
- **Custom Hooks**: Reusable state logic
- **Component Composition**: Reusable UI components
- **Controlled Components**: Form inputs managed by React state

---

## 🚀 Performance Metrics

| Operation | Time | API Calls | User Experience |
|-----------|------|-----------|----------------|
| **File Upload** | 3-4s | 4 (S3 + OpenAI×3) | Progress bar |
| **File Download** | 500ms | 2 (MongoDB + S3) | Instant |
| **File Delete** | 300ms | 2 (S3 + MongoDB) | Instant removal |
| **AI Search** | 1-2s | 2 (OpenAI + MongoDB) | Loading indicator |
| **Basic Search** | <50ms | 0 (client-side) | Real-time |
| **Expand/Collapse** | <10ms | 0 (state only) | Instant |

---

## 📈 Cost Analysis

### Monthly Costs (Estimated)

**For 100 documents with 1000 searches/month:**

| Service | Usage | Cost |
|---------|-------|------|
| **AWS S3** | 1GB storage + 100 uploads | ~$0.50 |
| **MongoDB Atlas** | M0 Free tier | $0.00 |
| **OpenAI - Embeddings** | 100 docs + 1000 searches | ~$0.15 |
| **OpenAI - GPT-3.5** | 200 API calls (keywords + summaries) | ~$0.02 |
| **Total** | | **~$0.67/month** |

**Free tier limits:**
- MongoDB: 512MB storage (enough for 50,000+ metadata docs)
- AWS S3: First 5GB free for 12 months
- OpenAI: No free tier, pay-as-you-go

---

## 🔄 CI/CD Pipeline (Future)

```
Git Push → GitHub
     ↓
GitHub Actions
     ↓
   ┌─────────┬─────────┐
   ▼         ▼         ▼
Backend   Frontend   Tests
 Build     Build      Run
   │         │         │
   └─────────┴─────────┘
           ↓
    Deploy to Cloud
     ↓         ↓
  Render    Vercel
(Backend) (Frontend)
```

---

## 📚 Further Reading

- [Complete Setup Guide](SETUP.md)
- [API Documentation](API.md)
- [NLP Implementation Details](NLP.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)

---

**Last Updated:** November 2025  
**Version:** 1.0.0