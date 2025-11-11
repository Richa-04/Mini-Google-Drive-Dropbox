# 📖 Complete Setup Guide

This guide walks you through setting up Mini Google Drive from scratch, including all required cloud services and dependencies.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

```bash
✅ Java 17 or higher installed
✅ Maven 3.6+ installed
✅ Node.js 16+ and npm installed
✅ Git installed
✅ Text editor/IDE (IntelliJ IDEA, VS Code, Eclipse)
✅ Modern web browser (Chrome, Firefox, Safari)
```

**Verify installations:**
```bash
java -version        # Should show 17+
mvn -version         # Should show 3.6+
node -version        # Should show 16+
npm -version         # Should show 8+
git --version        # Any recent version
```

---

## 1️⃣ Clone the Repository

```bash
# Clone the project
git clone https://github.com/Richa-04/Mini-Google-Drive-Dropbox.git
cd Mini-Google-Drive-Dropbox

# Verify structure
ls -la
# Should see: backend/ frontend/ README.md
```

---

## 2️⃣ MongoDB Atlas Setup (15 minutes)

### Step 1: Create Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"**
3. Sign up with email or Google account
4. Verify your email address

### Step 2: Create Cluster

1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. **Provider:** AWS
4. **Region:** Choose closest to you (e.g., US East, US West)
5. **Cluster Name:** Leave as default or name it `MiniGoogleDrive`
6. Click **"Create"**
7. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User

1. On the Security Quick Start screen:
2. **Authentication Method:** Username and Password
3. **Username:** `minigoogledrive` (or your choice)
4. **Password:** Click "Autogenerate Secure Password" or create your own
5. **⚠️ SAVE THIS PASSWORD IMMEDIATELY** - you'll need it later
6. Click **"Create User"**

### Step 4: Configure Network Access

1. Click **"Add IP Address"**
2. Choose **"Allow Access from Anywhere"**
3. This adds `0.0.0.0/0` to IP whitelist
4. **⚠️ For production:** Use specific IP addresses
5. Click **"Finish and Close"**

### Step 5: Get Connection String

1. Go to **Database** → Your cluster
2. Click **"Connect"**
3. Choose **"Connect your application"**
4. **Driver:** Java, **Version:** 4.3 or later
5. Copy the connection string:
   ```
   mongodb+srv://minigoogledrive:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>`** with your actual password
7. **Add database name** at the end:
   ```
   mongodb+srv://minigoogledrive:yourpassword@cluster0.xxxxx.mongodb.net/minigoogledrive
   ```

**✅ Test Connection (Optional):**
- Click **"Connect"** → **"Connect using MongoDB Compass"**
- Download Compass (MongoDB GUI)
- Paste connection string to verify it works

---

## 3️⃣ AWS S3 Setup (20 minutes)

### Step 1: Create AWS Account

1. Go to [AWS](https://aws.amazon.com/)
2. Click **"Create an AWS Account"**
3. Follow signup process (requires credit card, but won't be charged for free tier)
4. Complete identity verification
5. Choose **"Basic Support (Free)"** plan

### Step 2: Create S3 Bucket

1. Login to [AWS Console](https://console.aws.amazon.com/)
2. Search for **"S3"** in services
3. Click **"Create bucket"**

**Bucket Configuration:**
- **Bucket name:** `minigoogledrive-yourname-unique` (must be globally unique)
- **Region:** `us-east-1` (or your preferred region)
- **Object Ownership:** ACLs disabled (recommended)
- **Block Public Access:** Keep all checkboxes CHECKED (default)
- **Bucket Versioning:** Disabled
- **Encryption:** Server-side encryption (default)
- **Object Lock:** Disabled

4. Click **"Create bucket"**
5. **✅ Success:** You should see your bucket listed

### Step 3: Create IAM User for Application

1. Search for **"IAM"** in AWS Console
2. Go to **Users** → **"Create user"**

**User Configuration:**
- **User name:** `minigoogledrive-app-user`
- **AWS access type:** Programmatic access only (no console access needed)
- Click **"Next"**

**Permissions:**
- Choose **"Attach policies directly"**
- Search: `AmazonS3FullAccess`
- Check the box next to `AmazonS3FullAccess`
- Click **"Next"**

**Review:**
- Verify user name and policy
- Click **"Create user"**

### Step 4: Create Access Keys

1. Click on the newly created user `minigoogledrive-app-user`
2. Go to **"Security credentials"** tab
3. Scroll to **"Access keys"** section
4. Click **"Create access key"**

**Use Case:**
- Select **"Application running outside AWS"**
- Check confirmation box
- Click **"Next"**

**Description (Optional):**
- Add tag: `Mini Google Drive Application`
- Click **"Create access key"**

**⚠️ CRITICAL - Save Keys Immediately:**

You'll see:
```
Access key ID: AKIA... (starts with AKIA)
Secret access key: wJalrXUtnFEMI/K7MDENG/... (long random string)
```

**Actions:**
1. ✅ Click **"Download .csv file"** - saves to your computer
2. ✅ Copy both keys to a secure location
3. ✅ **YOU CANNOT SEE THE SECRET KEY AGAIN!**

**Security Tips:**
- Never commit these keys to GitHub
- Store in password manager
- Add to `.gitignore` if storing locally

### Step 5: Verify Setup

**In S3 Console:**
- ✅ Bucket created and listed
- ✅ Region noted (e.g., `us-east-1`)

**In IAM Console:**
- ✅ User created with `AmazonS3FullAccess` policy
- ✅ Access keys downloaded

---

## 4️⃣ OpenAI API Setup (10 minutes)

### Step 1: Create Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Click **"Sign Up"**
3. Create account with email or Google
4. Verify email address
5. Complete phone verification

### Step 2: Add Billing Method

**⚠️ Required for API access:**

1. Click your profile → **"Settings"** → **"Billing"**
2. Click **"Add payment method"**
3. Enter credit card information
4. **Set usage limits (Recommended):**
   - Hard limit: $10/month
   - Email alerts at: $5/month
5. Save payment method

**Cost Estimate:**
- GPT-3.5-turbo: $0.002 per 1K tokens
- text-embedding-ada-002: $0.0001 per 1K tokens
- **Expected monthly cost:** $0.50-2.00 for testing/development

**Free Credits:**
- New accounts may receive $5 free credits
- Valid for 3 months

### Step 3: Create API Key

1. Go to **"API keys"** section
2. Click **"Create new secret key"**

**Configuration:**
- **Name:** `Mini-Google-Drive`
- **Permissions:** All (default)
- Click **"Create secret key"**

**⚠️ SAVE KEY IMMEDIATELY:**
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Actions:**
1. ✅ Copy the entire key
2. ✅ Store in password manager or secure note
3. ✅ **YOU CANNOT SEE THIS KEY AGAIN!**

**Security:**
- Never share your API key
- Never commit to GitHub
- Rotate keys periodically

### Step 4: Verify Setup

**Test your key (Optional):**

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

If successful, you'll see a list of available models including `gpt-3.5-turbo` and `text-embedding-ada-002`.

---

## 5️⃣ Backend Configuration

### Step 1: Navigate to Configuration File

```bash
cd backend/src/main/resources/
```

### Step 2: Create/Edit application.properties

**Create file if doesn't exist:**
```bash
touch application.properties
```

**Add configuration:**

```properties
# Application Name
spring.application.name=googledrive

# MongoDB Configuration
# Replace: user, pass, cluster with your MongoDB credentials
spring.data.mongodb.uri=mongodb+srv://minigoogledrive:yourpassword@cluster0.xxxxx.mongodb.net/minigoogledrive
spring.data.mongodb.database=minigoogledrive

# AWS S3 Configuration
# Replace with your AWS credentials from Step 3
aws.access.key.id=AKIAIOSFODNN7EXAMPLE
aws.secret.access.key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
aws.s3.bucket.name=minigoogledrive-yourname-unique
aws.s3.region=us-east-1

# Server Configuration
server.port=8080

# File Upload Settings (50MB limit per file)
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# JWT Configuration
# Generate a strong random key (min 256 bits / 32 characters)
jwt.secret=MySecretJWTKeyForMiniGoogleDrive2024ChangeMeInProduction
jwt.expiration=86400000

# File Encryption (AES-256 requires exactly 32 characters)
file.encryption.key=MySecretEncryptionKey1234567890

# OpenAI Configuration (for NLP features)
# Replace with your OpenAI API key from Step 4
openai.api.key=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
openai.model=text-embedding-ada-002

# Logging (Optional - for debugging)
logging.level.org.springframework.data.mongodb=DEBUG
```

### Step 3: Secure Your Credentials

**⚠️ IMPORTANT - Prevent Credential Leaks:**

**Add to `.gitignore`:**

```bash
# Navigate to backend folder
cd backend

# Edit .gitignore (create if doesn't exist)
nano .gitignore
```

**Add these lines:**
```
# Configuration files with credentials
src/main/resources/application.properties
application.properties
*.properties

# Environment files
.env
.env.local
```

**Save and verify:**
```bash
git status
# application.properties should NOT appear in untracked files
```

### Step 4: Validate Configuration

**Checklist:**
- ✅ MongoDB URI has correct password
- ✅ AWS keys start with `AKIA...`
- ✅ S3 bucket name matches exactly (no typos)
- ✅ OpenAI key starts with `sk-proj-` or `sk-`
- ✅ JWT secret is at least 32 characters
- ✅ Encryption key is exactly 32 characters
- ✅ All placeholders replaced with real values

---

## 6️⃣ Build and Run Backend

### Step 1: Install Dependencies

```bash
# Navigate to backend folder
cd backend

# Clean and install (downloads all dependencies)
mvn clean install

# This will:
# - Download Spring Boot, AWS SDK, OpenAI client, Apache Tika
# - Compile Java code
# - Run tests (if any)
# - Create JAR file in target/
```

**Expected output:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: 45 s
```

**If errors occur:**
- Check Java version: `java -version` (must be 17+)
- Check Maven version: `mvn -version`
- Check internet connection (Maven downloads dependencies)

### Step 2: Run Application

```bash
mvn spring-boot:run
```

**Expected output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.5.7)

...
✅ Started GoogledriveApplication in 8.234 seconds
```

**Application running on:** `http://localhost:8080`

### Step 3: Verify Backend is Running

**Test endpoints:**

**1. Health check:**
```bash
curl http://localhost:8080/api/auth/login
# Should return 401 Unauthorized (expected - no credentials)
```

**2. Check MongoDB connection:**
- Look for log: `✅ Connected to MongoDB`
- No connection errors

**3. Check AWS S3 connection:**
- Upload a test file later to verify

**Common Startup Issues:**

**Port 8080 already in use:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill it
kill -9 <PID>
```

**MongoDB connection error:**
```
Could not connect to MongoDB: Authentication failed
```
**Fix:** Double-check username/password in connection string

**AWS credentials error:**
```
Unable to load credentials from any provider
```
**Fix:** Verify access key and secret key in application.properties

---

## 7️⃣ Frontend Setup

### Step 1: Install Dependencies

```bash
# Navigate to frontend folder (new terminal window)
cd frontend

# Install all npm packages
npm install

# This installs:
# - React, Material-UI, Axios, React Router
# - Takes 2-3 minutes
```

**Expected output:**
```
added 1453 packages in 2m
```

### Step 2: Configure API URL (Optional)

**If backend is not on localhost:8080:**

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8080
```

**Default:** Frontend assumes backend is on `http://localhost:8080`

### Step 3: Start Development Server

```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

webpack compiled with 0 errors
```

**Browser should automatically open to:** `http://localhost:3000`

### Step 4: Verify Frontend

**You should see:**
- ✅ Login/Signup page loads
- ✅ No console errors in browser DevTools (F12)
- ✅ Material-UI components render properly
- ✅ Purple gradient theme visible

**Common Issues:**

**Port 3000 in use:**
```bash
# React will prompt: "Something is already running on port 3000"
# Press 'y' to run on port 3001
```

**Dependencies error:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Cannot connect to backend:**
- Verify backend is running on port 8080
- Check browser console for CORS errors

---

## 8️⃣ First Time Setup

### Step 1: Create Your Account

1. Go to `http://localhost:3000/signup`
2. Fill in details:
   - First Name: Your name
   - Last Name: Your last name
   - Email: Your email
   - Password: Min 6 characters
3. Click **"Sign Up"**
4. You'll be redirected to login page

### Step 2: Login

1. Enter your credentials
2. Click **"Login"**
3. You should see the Dashboard!

### Step 3: Test File Upload with NLP

**Upload a PDF to test NLP features:**

1. Click the floating **+ button** (bottom right)
2. Select a PDF file (any research paper, document)
3. Watch upload progress
4. Wait 2-3 seconds for NLP processing

**Check backend console:**
```
✅ Generated embedding for: YourFile.pdf
✅ Extracted keywords for: YourFile.pdf → [keyword1, keyword2, ...]
✅ Generated summary for: YourFile.pdf
```

**Check frontend:**
- ✅ File appears in dashboard
- ✅ Expand arrow visible (▼)
- ✅ Click expand → Keywords and summary appear

**If NLP doesn't work:**
- Check OpenAI API key is correct
- Verify billing is set up in OpenAI account
- Check backend logs for OpenAI errors

### Step 4: Test AI Search

1. Toggle to **AI mode** (click AI/Basic toggle)
2. Search bar turns blue with robot icon
3. Type: "your topic" (related to your uploaded file)
4. Press Enter
5. Should see semantic search results

### Step 5: Test Other Features

- ✅ Download file
- ✅ Share file (use another email)
- ✅ Rename file
- ✅ Delete file
- ✅ Toggle Grid/List view
- ✅ Try filters (file type, date, sort)

---

## 9️⃣ Environment Variables (Production)

**For production deployment, use environment variables instead of hardcoded values:**

### Backend (application.properties)

```properties
# Use environment variables
spring.data.mongodb.uri=${MONGODB_URI}
aws.access.key.id=${AWS_ACCESS_KEY_ID}
aws.secret.access.key=${AWS_SECRET_ACCESS_KEY}
aws.s3.bucket.name=${AWS_S3_BUCKET_NAME}
openai.api.key=${OPENAI_API_KEY}
jwt.secret=${JWT_SECRET}
file.encryption.key=${FILE_ENCRYPTION_KEY}
```

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://your-backend-url.com
```

---

## 🔟 Verification Checklist

**Before considering setup complete:**

### Backend Verification
- ✅ `mvn spring-boot:run` starts without errors
- ✅ See: `Started GoogledriveApplication in X seconds`
- ✅ No MongoDB connection errors
- ✅ No AWS S3 configuration errors
- ✅ Port 8080 accessible

### Frontend Verification
- ✅ `npm start` compiles successfully
- ✅ Browser opens to `http://localhost:3000`
- ✅ Login page renders with purple theme
- ✅ No console errors in browser DevTools

### Integration Verification
- ✅ Can create account and login
- ✅ Can upload file (appears in dashboard)
- ✅ NLP processing works (keywords/summary generated)
- ✅ Can download file (decrypts properly)
- ✅ AI search returns results
- ✅ Can share, rename, delete files

### Cloud Services Verification
- ✅ Files appear in AWS S3 bucket (encrypted)
- ✅ Metadata appears in MongoDB Atlas
- ✅ OpenAI API calls succeed (check usage in OpenAI dashboard)

---

## 🛡️ Security Best Practices

### Development
- ✅ Use `.gitignore` to exclude `application.properties`
- ✅ Never commit API keys or passwords
- ✅ Use strong, unique passwords
- ✅ Limit MongoDB network access in production

### Production
- ✅ Use environment variables for all secrets
- ✅ Enable HTTPS/SSL
- ✅ Restrict CORS to your domain only
- ✅ Use AWS Secrets Manager or similar
- ✅ Enable MongoDB IP whitelisting
- ✅ Rotate API keys regularly
- ✅ Monitor OpenAI usage and costs

---

## 🆘 Getting Help

**If you encounter issues:**

1. **Check logs:**
   - Backend: Terminal where `mvn spring-boot:run` is running
   - Frontend: Browser console (F12)

2. **Common issues:**
   - See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

3. **Verify credentials:**
   - MongoDB: Test connection string in Compass
   - AWS: Verify keys are correct
   - OpenAI: Check API key starts with `sk-`

4. **GitHub Issues:**
   - [Report a bug](https://github.com/Richa-04/Mini-Google-Drive-Dropbox/issues)

---

## 🎉 Next Steps

**Setup complete! Now you can:**

1. **Explore features:**
   - Upload various file types
   - Test AI search with different queries
   - Try collaboration features

2. **Customize:**
   - Adjust storage limits
   - Modify UI theme
   - Add more features

3. **Deploy:**
   - See deployment guide (coming soon)
   - Deploy to Render, Vercel, or AWS

4. **Learn more:**
   - [Architecture Details](ARCHITECTURE.md)
   - [NLP Implementation](NLP.md)
   - [API Documentation](API.md)

---

**🚀 Happy coding! Your Mini Google Drive is ready to use!**