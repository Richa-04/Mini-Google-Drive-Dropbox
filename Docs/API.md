# 🔌 API Documentation

Complete REST API reference for Mini Google Drive.

**Base URL:** `http://localhost:8080`  
**Production URL:** `https://your-domain.com`

---

## 🔑 Authentication

All endpoints except `/api/auth/*` require JWT authentication.

**Authorization Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📡 Endpoints Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/signup` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Login and get JWT token |
| POST | `/api/files/upload` | ✅ | Upload file with NLP processing |
| GET | `/api/files` | ✅ | Get all user's files |
| GET | `/api/files/search/ai` | ✅ | AI semantic search |
| GET | `/api/files/download/{id}` | ✅ | Download decrypted file |
| PUT | `/api/files/rename/{id}` | ✅ | Rename file |
| DELETE | `/api/files/{id}` | ✅ | Delete file from S3 & MongoDB |
| POST | `/api/files/share` | ✅ | Share file with email |

---

## 🔐 Authentication Endpoints

### POST /api/auth/signup

Create a new user account.

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation:**
- Email: Must be valid format, unique
- Password: Minimum 6 characters
- First/Last Name: Required, non-empty

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk5MTIzNDU2LCJleHAiOjE2OTkyMDk4NTZ9.signature",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Error Responses:**
```json
// 400 Bad Request - Email already exists
{
  "error": "Email already registered"
}

// 400 Bad Request - Validation failed
{
  "error": "Password must be at least 6 characters"
}
```

---

### POST /api/auth/login

Authenticate user and receive JWT token.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Error Responses:**
```json
// 401 Unauthorized - Invalid credentials
{
  "error": "Invalid email or password"
}

// 404 Not Found - User doesn't exist
{
  "error": "User not found"
}
```

**Token Details:**
- **Expiration:** 24 hours (86400000ms)
- **Algorithm:** HS256
- **Use:** Include in all subsequent requests

---

## 📤 File Management Endpoints

### POST /api/files/upload

Upload file with automatic NLP processing (text extraction, keywords, summary, embedding).

**Request:**
```http
POST /api/files/upload
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

Body (form-data):
file: <binary file data>
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

**Processing Steps:**
1. Validate JWT and storage limit (15GB)
2. Encrypt file with AES-256
3. Upload encrypted file to S3
4. Extract text (if PDF/Doc)
5. Generate keywords (OpenAI GPT-3.5)
6. Generate summary (OpenAI GPT-3.5)
7. Generate embedding (OpenAI ada-002)
8. Save metadata to MongoDB

**Success Response (200 OK):**
```json
{
  "id": "673abc123def456...",
  "fileName": "uuid_document.pdf",
  "originalFileName": "AI_Research_Paper.pdf",
  "fileType": "application/pdf",
  "fileSize": 523700,
  "filePath": "s3://bucket/uuid_document.pdf",
  "ownerEmail": "user@example.com",
  "uploadedAt": "2025-11-11T11:20:00.123Z",
  "sharedWith": [],
  "keywords": [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "Neural Networks"
  ],
  "summary": "This paper examines AI and machine learning techniques for natural language processing tasks, focusing on deep learning models and their applications in real-world scenarios.",
  "embedding": [0.234, -0.456, 0.789, ... 1536 numbers]
}
```

**Error Responses:**
```json
// 413 Payload Too Large - File exceeds 50MB
{
  "error": "File size exceeds maximum allowed size of 50MB"
}

// 400 Bad Request - Storage limit exceeded
{
  "error": "Storage limit exceeded! You have 50 MB available, but file is 100 MB"
}

// 401 Unauthorized - Invalid token
{
  "error": "JWT token expired or invalid"
}
```

**Processing Time:**
- Small files (<1MB): 2-3 seconds
- Large files (10-50MB): 4-6 seconds

---

### GET /api/files

Retrieve all files owned by or shared with the user.

**Request:**
```http
GET /api/files
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": "673abc...",
    "originalFileName": "Project_Proposal.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "ownerEmail": "user@example.com",
    "uploadedAt": "2025-11-11T10:00:00Z",
    "sharedWith": ["colleague@example.com"],
    "keywords": ["project", "proposal", "innovation"],
    "summary": "Detailed project proposal for new initiative..."
  },
  {
    "id": "456def...",
    "originalFileName": "Shared_Report.pdf",
    "fileType": "application/pdf",
    "fileSize": 512000,
    "ownerEmail": "boss@example.com",
    "uploadedAt": "2025-11-10T15:30:00Z",
    "sharedWith": ["user@example.com", "team@example.com"],
    "keywords": ["quarterly", "report", "analysis"],
    "summary": "Q3 quarterly performance analysis..."
  }
]
```

**Notes:**
- Returns files owned by user + files shared with user
- Sorted by upload date (newest first)
- Includes all NLP metadata (keywords, summary, embedding)

---

### GET /api/files/search/ai

AI-powered semantic search using natural language queries.

**Request:**
```http
GET /api/files/search/ai?query=project+ideas
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `query` (required): Natural language search query

**cURL Example:**
```bash
curl -X GET "http://localhost:8080/api/files/search/ai?query=machine%20learning%20projects" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Processing:**
1. Generate embedding for query using OpenAI ada-002
2. Calculate cosine similarity with all file embeddings
3. Filter results with similarity > 0.78 (78%)
4. Sort by similarity (highest first)
5. Return top 3 results

**Success Response (200 OK):**
```json
[
  {
    "id": "673abc...",
    "originalFileName": "ML_Project_Ideas.pdf",
    "keywords": ["machine learning", "projects", "ideas"],
    "summary": "Collection of ML project proposals...",
    "similarity": 0.87  // Not included in actual response, just for reference
  },
  {
    "id": "456def...",
    "originalFileName": "AI_Research.pdf",
    "keywords": ["artificial intelligence", "research"],
    "summary": "Research paper on AI applications...",
    "similarity": 0.82
  },
  {
    "id": "789ghi...",
    "originalFileName": "Data_Science_Guide.pdf",
    "keywords": ["data science", "machine learning"],
    "summary": "Comprehensive guide to data science...",
    "similarity": 0.79
  }
]
```

**Empty Results (200 OK):**
```json
[]
```

**Example Queries:**
- `project proposals` → Finds brainstorming docs, project plans
- `budget analysis` → Finds financial reports, expense sheets
- `python tutorial` → Finds programming guides, code documentation
- `meeting notes` → Finds minutes, summaries, action items

**Search Time:** ~1-2 seconds (includes OpenAI API call)

---

### GET /api/files/download/{fileId}

Download and decrypt a file.

**Request:**
```http
GET /api/files/download/673abc123def456
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `fileId`: MongoDB document ID

**Success Response (200 OK):**
```
Content-Type: application/pdf (or original file type)
Content-Disposition: attachment; filename="document.pdf"

<binary file data - decrypted>
```

**Process:**
1. Fetch metadata from MongoDB (includes encryption key)
2. Download encrypted file from S3
3. Decrypt using AES-256 with stored key
4. Return decrypted file bytes

**Error Responses:**
```json
// 404 Not Found
{
  "error": "File not found"
}

// 403 Forbidden - User doesn't own or have access
{
  "error": "Access denied"
}
```

---

### PUT /api/files/rename/{fileId}

Rename a file (owner only).

**Request:**
```http
PUT /api/files/rename/673abc123?newFileName=Updated_Document.pdf
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `newFileName`: New filename (required)

**cURL Example:**
```bash
curl -X PUT "http://localhost:8080/api/files/rename/673abc123?newFileName=New_Name.pdf" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200 OK):**
```json
{
  "id": "673abc123",
  "originalFileName": "Updated_Document.pdf",
  "fileType": "application/pdf",
  ...
}
```

**Error Responses:**
```json
// 403 Forbidden - Not the owner
{
  "error": "You don't have permission to rename this file"
}

// 404 Not Found
{
  "error": "File not found"
}
```

**Notes:**
- Only owner can rename
- S3 filename (UUID-based) stays same
- Only user-facing name changes

---

### DELETE /api/files/{fileId}

Delete file from both S3 and MongoDB (owner only).

**Request:**
```http
DELETE /api/files/673abc123def456
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8080/api/files/673abc123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200 OK):**
```json
{
  "message": "File deleted successfully"
}
```

**Process:**
1. Validate user is owner
2. Delete from AWS S3
3. Delete metadata from MongoDB
4. Both operations atomic (if S3 fails, MongoDB not deleted)

**Error Responses:**
```json
// 403 Forbidden
{
  "error": "You don't have permission to delete this file"
}

// 404 Not Found
{
  "error": "File not found"
}
```

---

### POST /api/files/share

Share a file with another user via email.

**Request:**
```http
POST /api/files/share
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "fileId": "673abc123def456",
  "shareWithEmail": "colleague@example.com"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/files/share \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileId":"673abc123","shareWithEmail":"colleague@example.com"}'
```

**Success Response (200 OK):**
```json
{
  "id": "673abc123",
  "originalFileName": "Shared_Document.pdf",
  "ownerEmail": "user@example.com",
  "sharedWith": ["colleague@example.com"],
  ...
}
```

**Error Responses:**
```json
// 403 Forbidden - Not the owner
{
  "error": "You don't have permission to share this file"
}

// 400 Bad Request - Already shared
{
  "error": "File already shared with this user"
}

// 404 Not Found
{
  "error": "File not found"
}
```

**Notes:**
- Email doesn't need to be registered (future access)
- File appears in recipient's "Shared with me" view
- Owner retains full control (delete, rename)

---

## 📊 Response Objects

### FileMetadata Object

```typescript
interface FileMetadata {
  id: string;                    // MongoDB ObjectId
  fileName: string;              // S3 key (UUID-based)
  originalFileName: string;      // User-facing name
  fileType: string;              // MIME type
  fileSize: number;              // Bytes
  filePath: string;              // S3 URI
  ownerEmail: string;            // File owner
  uploadedAt: string;            // ISO 8601 datetime
  encryptionKey: string;         // AES-256 key (base64)
  sharedWith: string[];          // Array of emails
  embedding: number[];           // 1536 numbers (optional)
  keywords: string[];            // 5-7 keywords (optional)
  summary: string;               // 2-3 sentences (optional)
}
```

### User Object

```typescript
interface User {
  email: string;
  firstName: string;
  lastName: string;
}
```

### AuthResponse Object

```typescript
interface AuthResponse {
  token: string;      // JWT token
  email: string;
  firstName: string;
  lastName: string;
}
```

---

## 🔍 Search Comparison

### Basic Search (Client-Side)

**Not an API endpoint** - handled by frontend filtering.

**How it works:**
```javascript
// Frontend code
const filtered = files.filter(file => 
  file.originalFileName.toLowerCase().includes(query.toLowerCase())
);
```

**Characteristics:**
- Instant (<50ms)
- Matches filename only
- Case-insensitive
- No AI involved

---

### AI Semantic Search (API Endpoint)

**Endpoint:** `GET /api/files/search/ai?query={query}`

**How it works:**
1. Query → OpenAI Embedding → Vector
2. Compare with all file embeddings
3. Return semantically similar files

**Characteristics:**
- ~1-2 seconds (API call)
- Understands meaning, not just keywords
- Searches document content
- Returns top 3 most relevant

**Example Comparison:**

**Query:** "machine learning"

**Basic Search Results:**
- `ML_Tutorial.pdf` ✅ (has "ML" in name)
- `machine_learning_guide.pdf` ✅ (exact match)

**AI Search Results:**
- `AI_Research_Paper.pdf` ✅ (discusses ML in content)
- `Neural_Networks.pdf` ✅ (semantically related)
- `Deep_Learning_Guide.pdf` ✅ (related concept)
- `ML_Tutorial.pdf` ✅ (exact match)

---

## 🛡️ Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message describing what went wrong",
  "timestamp": "2025-11-11T12:00:00Z",
  "path": "/api/files/upload"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | User signup successful |
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Valid token but no permission |
| 404 | Not Found | File or user doesn't exist |
| 413 | Payload Too Large | File exceeds 50MB limit |
| 500 | Internal Server Error | Server-side error |

---

## 🔄 Request/Response Examples

### Complete Upload Flow Example

**1. Login to get token:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Response:
{
  "token": "eyJhbG...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**2. Upload file with NLP:**
```bash
curl -X POST http://localhost:8080/api/files/upload \
  -H "Authorization: Bearer eyJhbG..." \
  -F "file=@research_paper.pdf"

# Response includes keywords and summary after ~3 seconds
```

**3. Search semantically:**
```bash
curl -X GET "http://localhost:8080/api/files/search/ai?query=research%20papers" \
  -H "Authorization: Bearer eyJhbG..."

# Returns top 3 semantically similar documents
```

**4. Download file:**
```bash
curl -X GET http://localhost:8080/api/files/download/673abc123 \
  -H "Authorization: Bearer eyJhbG..." \
  --output downloaded_file.pdf

# File is decrypted and saved
```

---

## 🎯 Rate Limits & Quotas

### Application Limits
- **File size:** 50MB per file
- **Storage:** 15GB per user
- **Concurrent uploads:** No hard limit (bandwidth dependent)

### OpenAI API Limits
- **GPT-3.5-turbo:** 3,500 requests/minute (tier-based)
- **text-embedding-ada-002:** 3,000 requests/minute
- **Your usage:** ~4 API calls per upload (keywords + summary + embedding)

### AWS S3 Limits
- **PUT requests:** No limit
- **Bandwidth:** No limit
- **Storage:** Unlimited (costs scale)

---

## 🧪 Testing with Postman

### Import Collection

**Create Postman collection with these requests:**

1. **Signup** - POST `/api/auth/signup`
2. **Login** - POST `/api/auth/login` → Save token
3. **Upload** - POST `/api/files/upload` → Use saved token
4. **Get Files** - GET `/api/files`
5. **AI Search** - GET `/api/files/search/ai?query=test`
6. **Download** - GET `/api/files/download/{id}`
7. **Share** - POST `/api/files/share`
8. **Rename** - PUT `/api/files/rename/{id}?newFileName=new.pdf`
9. **Delete** - DELETE `/api/files/{id}`

**Environment Variables:**
- `base_url`: `http://localhost:8080`
- `jwt_token`: `{{token}}` (auto-set from login response)

---

## 📈 API Performance Metrics

| Endpoint | Avg Response Time | API Calls | Database Ops |
|----------|------------------|-----------|--------------|
| Signup | 150ms | 0 | 1 write |
| Login | 100ms | 0 | 1 read |
| Upload (no NLP) | 500ms | 1 (S3) | 1 write |
| Upload (with NLP) | 2-3s | 4 (S3 + OpenAI×3) | 1 write |
| Get Files | 200ms | 0 | 1-2 reads |
| AI Search | 1-2s | 1 (OpenAI) | 1 read |
| Download | 400ms | 1 (S3) | 1 read |
| Delete | 300ms | 1 (S3) | 1 delete |

---

## 🔐 Security Headers

### CORS Configuration

**Allowed Origins:**
```java
http://localhost:3000  // Development
https://your-domain.com  // Production
```

**Allowed Methods:**
```
GET, POST, PUT, DELETE, OPTIONS
```

**Allowed Headers:**
```
Authorization, Content-Type
```

### Security Headers in Response

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## 📚 API Versioning (Future)

**Current:** `/api/auth/*`, `/api/files/*`  
**Future v2:** `/api/v2/files/*`

**Backward compatibility maintained.**

---

## 🛠️ Development Tools

**Recommended Tools for API Testing:**
- **Postman**: Full-featured API client
- **cURL**: Command-line testing
- **Browser DevTools**: Network tab inspection
- **Swagger/OpenAPI**: Auto-generated docs (future enhancement)

---

**📖 Related Documentation:**
- [Setup Guide](SETUP.md)
- [Architecture Details](ARCHITECTURE.md)
- [NLP Implementation](NLP.md)
- [Troubleshooting](TROUBLESHOOTING.md)