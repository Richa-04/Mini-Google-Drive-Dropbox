# 🐛 Troubleshooting Guide

Common issues and solutions for Mini Google Drive.

---

## 🔍 Quick Diagnosis

**Use this flowchart to identify your issue:**

```
Can't start backend?
├─ Port 8080 in use → See "Backend Won't Start"
├─ MongoDB error → See "MongoDB Connection Issues"
└─ AWS error → See "AWS S3 Issues"

Can't start frontend?
├─ Port 3000 in use → See "Frontend Won't Start"
├─ Dependencies error → See "NPM Issues"
└─ Can't connect to backend → See "CORS Errors"

App running but features broken?
├─ Can't upload → See "Upload Failures"
├─ NLP not working → See "NLP Issues"
├─ Search broken → See "Search Issues"
└─ Download fails → See "Download Issues"
```

---

## 🖥️ Backend Issues

### Backend Won't Start

#### Issue: Port 8080 Already in Use
```
Error: Port 8080 is already in use
```

**Solution:**
```bash
# Mac/Linux - Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Windows - Find process
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <PID> /F

# Alternative: Change port in application.properties
server.port=8081
```

---

#### Issue: Java Version Mismatch
```
Error: Unsupported class file major version
```

**Solution:**
```bash
# Check Java version
java -version

# Must be 17 or higher
# If lower, install Java 17:
# Mac: brew install openjdk@17
# Windows: Download from Oracle or AdoptOpenJDK
# Linux: sudo apt install openjdk-17-jdk
```

---

#### Issue: Maven Build Fails
```
[ERROR] Failed to execute goal
```

**Solutions:**

**1. Clean and rebuild:**
```bash
mvn clean
mvn clean install -U
```

**2. Clear Maven cache:**
```bash
rm -rf ~/.m2/repository
mvn clean install
```

**3. Check pom.xml:**
- Verify all dependencies are accessible
- Check for version conflicts
- Ensure internet connection for downloads

---

### MongoDB Connection Issues

#### Issue: Authentication Failed
```
MongoSecurityException: Exception authenticating
```

**Checklist:**
- ✅ Username correct in connection string?
- ✅ Password correct (no special chars breaking URI)?
- ✅ Database name included at end of URI?
- ✅ User created in MongoDB Atlas?

**Solution:**
```properties
# Correct format
spring.data.mongodb.uri=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE_NAME

# Common mistakes
❌ Missing database name
❌ Password has special chars (! @ # $) - must URL encode
❌ Wrong username/password
```

**URL Encode Special Characters:**
```
@ → %40
! → %21
# → %23
$ → %24
```

---

#### Issue: Network Timeout
```
MongoTimeoutException: Timed out after 30000 ms
```

**Solutions:**

**1. Check network access in MongoDB Atlas:**
- Go to Security → Network Access
- Verify `0.0.0.0/0` is in IP whitelist
- Or add your current IP

**2. Check firewall:**
```bash
# Test MongoDB connection
ping cluster0.xxxxx.mongodb.net

# If fails, firewall might be blocking
```

**3. Cluster might be paused (free tier):**
- Login to MongoDB Atlas
- Check if cluster shows "Paused"
- Click "Resume" if paused

---

### AWS S3 Issues

#### Issue: Unable to Upload to S3
```
AmazonS3Exception: Access Denied
```

**Checklist:**
- ✅ Access Key ID starts with `AKIA...`?
- ✅ Secret Access Key has no extra spaces?
- ✅ IAM user has `AmazonS3FullAccess` policy?
- ✅ Bucket name matches exactly (case-sensitive)?
- ✅ Bucket exists in correct region?

**Solution:**

**1. Verify IAM permissions:**
- AWS Console → IAM → Users → Your user
- Check "Permissions" tab
- Should have `AmazonS3FullAccess` policy attached

**2. Test credentials:**
```bash
# Using AWS CLI
aws s3 ls s3://your-bucket-name --profile your-profile

# If this fails, credentials are wrong
```

**3. Check bucket region:**
```properties
# application.properties
aws.s3.region=us-east-1  # Must match your bucket's region
```

---

#### Issue: Bucket Not Found
```
AmazonS3Exception: The specified bucket does not exist
```

**Solution:**
- Verify bucket name in `application.properties` matches AWS Console
- Check you're looking in correct region
- Bucket names are globally unique (no typos!)

---

### OpenAI API Issues

#### Issue: Invalid API Key
```
OpenAIException: Incorrect API key provided
```

**Solutions:**

**1. Verify key format:**
```
✅ Correct: sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
❌ Wrong: sk-xxxxxxxx (missing proj-)
❌ Wrong: Has spaces or newlines
```

**2. Check key is active:**
- Login to OpenAI Platform
- Go to API Keys
- Verify key is listed and not revoked

**3. Check application.properties:**
```properties
openai.api.key=sk-proj-xxxxxxxxxxxx
# No quotes, no spaces, no newlines
```

---

#### Issue: Insufficient Credits/Billing
```
OpenAIException: You exceeded your current quota
```

**Solutions:**

**1. Check OpenAI billing:**
- OpenAI Platform → Billing
- Verify payment method added
- Check usage limits not exceeded

**2. Add credits:**
- Add $5-10 to account
- Set usage limit to prevent overcharges

**3. Check free tier:**
- New accounts get $5 free (3 months)
- After expiration, must add payment

---

#### Issue: Rate Limit Exceeded
```
OpenAIException: Rate limit reached
```

**Solution:**
- Wait 1 minute and retry
- Implement retry logic with exponential backoff
- Upgrade OpenAI tier for higher limits

---

## 💻 Frontend Issues

### Frontend Won't Start

#### Issue: Dependencies Not Installed
```
Error: Cannot find module 'react'
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

#### Issue: Port 3000 Already in Use
```
Something is already running on port 3000
```

**Solution:**
```bash
# Option 1: Run on different port
# React will prompt: Would you like to run on port 3001? (Y/n)
# Press 'y'

# Option 2: Kill process on port 3000
# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### CORS Errors

#### Issue: CORS Policy Blocking Requests
```
Access to fetch has been blocked by CORS policy
```

**Browser Console Shows:**
```
CORS error: No 'Access-Control-Allow-Origin' header present
```

**Solution:**

**1. Check backend SecurityConfig.java:**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:3000"  // ← Add this
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

**2. Restart backend after changes**

**3. Clear browser cache:**
```
Chrome: Ctrl+Shift+Delete → Clear cache
```

---

## 📤 Upload Issues

### Upload Fails - File Too Large
```
Error: File size exceeds maximum allowed size
```

**Solutions:**

**1. Check file size:**
- Maximum: 50MB per file
- Compress large files if possible

**2. Increase limit (if needed):**
```properties
# application.properties
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB
```

---

### Upload Fails - Storage Limit Exceeded
```
Error: Storage limit exceeded! You have 50 MB available, but file is 100 MB
```

**Solutions:**

**1. Delete old files:**
- Free up space by deleting unnecessary files

**2. Increase limit (development only):**
```java
// FileService.java
private static final long STORAGE_LIMIT = 20L * 1024 * 1024 * 1024; // 20 GB
```

**3. Check actual usage:**
- Dashboard sidebar shows current storage
- MongoDB: Count total fileSize for your email

---

## 🤖 NLP Issues

### Keywords/Summary Not Generated

#### Issue: NLP Features Missing for Uploaded File

**Symptoms:**
- File uploads successfully
- No expand arrow appears
- Keywords and summary are empty

**Diagnosis:**

**1. Check file type:**
```bash
# Only these types get NLP processing:
✅ PDF (.pdf)
✅ Word (.doc, .docx)
✅ Text (.txt)
❌ Images (.jpg, .png) - excluded by design
```

**2. Check backend logs:**

**Look for:**
```
✅ Generated embedding for: filename.pdf
✅ Extracted keywords for: filename.pdf → [...]
✅ Generated summary for: filename.pdf
```

**If missing:**
```
❌ Text extraction failed: ...
❌ Keyword extraction failed: ...
❌ Summary generation failed: ...
```

**3. Common causes:**

**A. File is an image:**
- Images don't get NLP (by design)
- Solution: Only text-based files get keywords/summary

**B. OpenAI API error:**
- Check API key is valid
- Check billing is set up
- Check usage quota not exceeded

**C. Text extraction failed:**
- File might be corrupted
- File might be scanned PDF (images, not text)
- Try uploading different file

---

### OpenAI API Calls Failing

#### Issue: All NLP Features Failing
```
Failed to generate NLP features: API key invalid
```

**Solutions:**

**1. Verify API key:**
```bash
# Check application.properties
cat backend/src/main/resources/application.properties | grep openai.api.key

# Should show: openai.api.key=sk-proj-xxxxx
# NOT: openai.api.key=YOUR_OPENAI_KEY (placeholder)
```

**2. Test API key manually:**
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# Should return list of models
# If error, key is invalid
```

**3. Check OpenAI account:**
- Login to platform.openai.com
- Verify billing method added
- Check usage dashboard for errors

---

### Embeddings Not Being Generated

#### Issue: AI Search Returns Empty Results

**Diagnosis:**
```bash
# Check MongoDB
# Open file document
# Look for "embedding" field
# If null or empty → embeddings not generated
```

**Solutions:**

**1. Check file type:**
- Only PDFs/Docs get embeddings
- Images don't have embeddings

**2. Check text extraction:**
- If text extraction fails, no embedding generated
- Upload text-heavy PDF to test

**3. Check OpenAI model:**
```properties
# application.properties
openai.model=text-embedding-ada-002  # Must be exactly this
```

---

## 🔍 Search Issues

### AI Search Returns No Results

**Possible Causes:**

**1. No files have embeddings:**
- Old files uploaded before NLP feature
- Solution: Delete and re-upload files

**2. Query too specific:**
- Very specific queries might not match
- Try broader terms

**3. Threshold too high:**
- 78% might be too strict
- Temporarily lower for testing:
```java
.filter(item -> item.score > 0.50)  // Try 50% threshold
```

**4. All files are images:**
- Images don't have embeddings
- Upload some PDFs to test

---

### Basic Search Not Working

**Issue:** Typing in search bar doesn't filter files

**Solutions:**

**1. Check search mode:**
- Make sure you're in "Basic" mode (not AI mode)
- AI mode requires pressing Enter

**2. Check browser console:**
```javascript
// Should see files being filtered in real-time
console.log('Filtered files:', filteredFiles);
```

**3. Verify search function:**
```javascript
// Dashboard.jsx
const filtered = files.filter(file =>
    file.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())
);
```

---

## 📥 Download Issues

### Downloaded File is Corrupted/Encrypted

**Symptoms:**
- File downloads but won't open
- Shows random binary data
- Error: "File is damaged"

**Cause:** Decryption failed

**Solutions:**

**1. Verify encryption key:**
```properties
# application.properties
file.encryption.key=MySecretEncryptionKey1234567890
# Must be exactly 32 characters
# Must be same key used during upload
```

**2. Check if you changed encryption key:**
- If you changed the key after uploading files
- Old files can't be decrypted with new key
- Solution: Use original key or re-upload files

**3. Check MongoDB metadata:**
- Each file has its own encryption key
- Verify `encryptionKey` field exists

---

### Download Returns 403 Forbidden

**Cause:** User doesn't own file and it's not shared with them

**Solutions:**
- File must be owned by you OR shared with your email
- Check `ownerEmail` and `sharedWith` fields in MongoDB
- Verify you're logged in with correct account

---

## 🗑️ Delete Issues

### Delete Removes from UI But File Still in S3

**Cause:** MongoDB deleted but S3 delete failed

**Solution:**

**1. Manually delete from S3:**
- AWS Console → S3 → Your bucket
- Find orphaned files (check creation date)
- Select and delete

**2. Check AWS credentials:**
- IAM user must have delete permissions
- Verify `AmazonS3FullAccess` policy attached

**3. Check S3 connection:**
```bash
# Backend logs should show
Deleting object: uuid_filename.pdf from bucket: your-bucket-name
```

---

## 🤝 Sharing Issues

### Share Fails - "Already Shared"

**Expected Behavior:** Prevents duplicate shares

**If getting error incorrectly:**

**Check MongoDB:**
```javascript
// File document in MongoDB
{
  "sharedWith": ["user1@example.com", "user2@example.com"]
}
```

**Solution:**
- This is correct behavior (preventing duplicates)
- If you want to re-share, this is prevented by design
- Remove email from `sharedWith` array in MongoDB to test

---

### Shared Files Don't Appear

**Issue:** File shared but doesn't show in "Shared with me"

**Diagnosis:**

**1. Check MongoDB:**
```javascript
// Verify sharedWith array contains your email
{
  "ownerEmail": "owner@example.com",
  "sharedWith": ["your@example.com"]  // Your email must be here
}
```

**2. Check view filter:**
```java
// Should filter files where
file.getSharedWith().contains(userEmail) && 
!file.getOwnerEmail().equals(userEmail)
```

**3. Refresh files:**
- Click "Shared with me" tab again
- Or reload page

---

## 🎨 UI/UX Issues

### Expand/Collapse Not Working

#### Issue: Keywords/Summary Always Showing (Grid View)

**Solution:**

**Check condition in Dashboard.jsx:**
```jsx
// Must have this condition
{expandedFiles.has(file.id) && file.keywords && ...}
// NOT just: {file.keywords && ...}
```

---

#### Issue: Multiple Cards Expanding Together

**Cause:** Incorrect file ID being passed

**Solution:**

**Verify expand button:**
```jsx
<IconButton onClick={(e) => {
    e.stopPropagation();  // ← Important!
    toggleFileExpand(file.id);  // ← Must use file.id
}}>
```

**Check toggleFileExpand function:**
```jsx
const toggleFileExpand = (fileId) => {  // ← Parameter name
    setExpandedFiles(prev => {
        const newSet = new Set(prev);
        if (newSet.has(fileId)) {  // ← Use parameter
            newSet.delete(fileId);
        } else {
            newSet.add(fileId);
        }
        return newSet;
    });
};
```

---

### Storage Bar Showing Incorrect Percentage

**Issue:** Bar shows 100% full when only 20MB used

**Cause:** Wrong divisor in calculation

**Solution:**
```jsx
// Dashboard.jsx - Storage bar width
width: `${Math.min((
    files.reduce((acc, f) => acc + f.fileSize, 0) / 15000000000  // ← 15 GB in bytes
) * 100, 100)}%`

// NOT: / 15000000 (this is only 15 MB!)
```

**Correct calculation:**
- 15 GB = 15 × 1024 × 1024 × 1024 = 16,106,127,360 bytes
- Simplified: 15,000,000,000 (close enough)

---

## 🔄 State Management Issues

### Files Keep Reloading/Refreshing

**Symptoms:**
- Every action (share, rename, delete) causes visible reload
- Loading spinner appears unnecessarily

**Diagnosis:**

**1. Check for unnecessary `loadFiles()` calls:**
```bash
# Search your Dashboard.jsx
grep -n "loadFiles()" Dashboard.jsx

# Should ONLY appear in:
# - useEffect(() => { loadFiles(); }, [])  ← Initial load
# - Inside loadFiles function definition
# - Nowhere else!
```

**2. Check useEffect dependencies:**
```jsx
// ❌ WRONG - causes infinite loops
useEffect(() => {
    loadFiles();
}, [files]);  // Don't depend on files!

// ✅ CORRECT - loads once
useEffect(() => {
    loadFiles();
}, []);  // Empty array = run once
```

**Solution:**

**Remove `loadFiles()` from:**
- handleDelete
- handleRename
- handleShare
- handleFileUpload success callback

**Instead use state updates:**
```jsx
// Delete
setFiles(prev => prev.filter(f => f.id !== deletedId));

// Rename
setFiles(prev => prev.map(f => 
    f.id === renamedId ? {...f, originalFileName: newName} : f
));
```

---

## 🔐 Security Issues

### JWT Token Expired

**Issue:** Logged out after 24 hours

**Expected Behavior:** Tokens expire for security

**Solution:**
- Login again to get new token
- Or increase expiration (not recommended for production):
```properties
jwt.expiration=172800000  # 48 hours
```

---

### JAXB Warning

**Warning in logs:**
```
WARN: JAXB is unavailable. Will fallback to SDK implementation
```

**Impact:** None (cosmetic warning only)

**Solution (Optional):**
```xml
<!-- Add to pom.xml -->
<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
    <version>2.3.1</version>
</dependency>
```

---

## 🧹 Data Cleanup Issues

### Orphaned Files in S3

**Cause:** Deleted from MongoDB but not S3

**Solution:**

**1. Manual cleanup:**
- AWS Console → S3 → Your bucket
- Sort by date → Find old files
- Delete manually

**2. Prevention:**
- Always use app's delete button (deletes from both)
- Never manually delete from MongoDB

**3. Automated cleanup (future):**
```java
// Scheduled job to find orphaned files
@Scheduled(cron = "0 0 2 * * ?")  // Run at 2 AM daily
public void cleanupOrphanedFiles() {
    // Compare S3 files with MongoDB
    // Delete orphans
}
```

---

### Broken References in MongoDB

**Cause:** Deleted from S3 but not MongoDB

**Symptoms:**
- File shows in UI
- Download fails with error

**Solution:**

**1. Find broken references:**
```javascript
// MongoDB query
db.files.find({
    filePath: { $regex: "deleted_file_name" }
})
```

**2. Delete from MongoDB:**
```javascript
db.files.deleteOne({ _id: ObjectId("673abc...") })
```

---

## 🔢 Performance Issues

### Slow Upload Times

**Diagnosis:**

**1. Check file size:**
- Larger files = longer upload
- 1MB: ~1s, 10MB: ~3s, 50MB: ~8s

**2. Check network speed:**
```bash
# Test upload speed to S3
aws s3 cp test_file.pdf s3://your-bucket/ --profile your-profile
```

**3. Check NLP processing:**
- NLP adds 2-3s per document
- This is normal for AI processing

**Solutions:**
- Reduce file size (compress PDFs)
- Upgrade internet connection
- For production: Use CDN for faster uploads

---

### Slow AI Search

**Expected:** 1-2 seconds (includes OpenAI API call)

**If >5 seconds:**

**1. Check OpenAI API latency:**
```bash
# Test API response time
time curl https://api.openai.com/v1/embeddings \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"model":"text-embedding-ada-002","input":"test"}'
```

**2. Check number of files:**
- Many files (1000+) = slower similarity calculation
- Solution: Implement vector database (Pinecone, Weaviate)

**3. Check network:**
- OpenAI API requires internet
- Poor connection = slow responses

---

## 📊 MongoDB Issues

### Database Growing Too Large

**Free tier limit:** 512MB

**Solutions:**

**1. Check current size:**
- MongoDB Atlas → Cluster → Metrics
- View storage usage

**2. Clean up:**
- Delete old files
- Remove embeddings (saves space but breaks search):
```javascript
db.files.updateMany({}, { $unset: { embedding: "" } })
```

**3. Upgrade tier:**
- M10 tier: 10GB storage ($0.08/hour = ~$60/month)

---

## 🌐 Network Issues

### Cannot Reach OpenAI API

```
Connection timeout to api.openai.com
```

**Solutions:**

**1. Check internet connection:**
```bash
ping api.openai.com
```

**2. Check firewall:**
- Corporate/school networks might block OpenAI
- Test from different network

**3. Check proxy settings:**
- If behind proxy, configure in application

---

## 🔄 Still Having Issues?

### Get Debug Information

**1. Backend logs:**
```bash
# Run with debug logging
mvn spring-boot:run -Dlogging.level.root=DEBUG
```

**2. Frontend console:**
```javascript
// Open browser DevTools (F12)
// Check Console tab for errors
// Check Network tab for failed requests
```

**3. MongoDB logs:**
```bash
# MongoDB Atlas → Cluster → Metrics → View Logs
```

**4. AWS CloudWatch:**
```bash
# Check S3 access logs (if enabled)
```

---

### Report a Bug

**If issue persists:**

1. **Gather information:**
   - Error message (exact text)
   - Steps to reproduce
   - Browser/OS version
   - Backend logs
   - Frontend console errors

2. **Create GitHub Issue:**
   - [Report Bug](https://github.com/Richa-04/Mini-Google-Drive-Dropbox/issues/new)
   - Use bug report template
   - Include all gathered information

---

## ✅ Health Check Checklist

**Run through this when something breaks:**

### Backend Health
```bash
✅ Backend running on port 8080?
✅ MongoDB connection successful?
✅ AWS S3 credentials valid?
✅ OpenAI API key configured?
✅ No errors in startup logs?
```

### Frontend Health
```bash
✅ Frontend running on port 3000?
✅ Can reach http://localhost:3000?
✅ No console errors in browser?
✅ Can see login page?
```

### Integration Health
```bash
✅ Can create account?
✅ Can login?
✅ Can upload file?
✅ Can see files in dashboard?
✅ Can download file?
```

### NLP Health
```bash
✅ Keywords generated for PDFs?
✅ Summary generated for PDFs?
✅ Expand button appears?
✅ AI search returns results?
```

---

## 🆘 Emergency Fixes

### Nuclear Option: Fresh Start

**If everything is broken:**

```bash
# 1. Stop all processes
# Ctrl+C in backend terminal
# Ctrl+C in frontend terminal

# 2. Clean everything
cd backend
mvn clean
rm -rf target/

cd ../frontend
rm -rf node_modules/ build/

# 3. Reset databases (CAREFUL - deletes all data!)
# MongoDB Atlas → Database → Collections → Drop collection "files"
# AWS S3 → Select all files → Delete

# 4. Fresh install
cd backend
mvn clean install
mvn spring-boot:run

cd ../frontend
npm install
npm start

# 5. Create new account and test
```

---

## 📞 Getting Help

**Resources:**

1. **Documentation:**
   - [Setup Guide](SETUP.md)
   - [Architecture](ARCHITECTURE.md)
   - [API Reference](API.md)
   - [NLP Guide](NLP.md)

2. **External Resources:**
   - [Spring Boot Docs](https://spring.io/projects/spring-boot)
   - [MongoDB Atlas Support](https://www.mongodb.com/docs/atlas/)
   - [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
   - [OpenAI API Docs](https://platform.openai.com/docs)

3. **Community:**
   - Stack Overflow (tag: spring-boot, react, mongodb)
   - GitHub Issues
   - Discord/Slack communities

---

**💡 Pro Tip:** Most issues are configuration-related. Double-check your `application.properties` and verify all credentials are correct!

**Last Updated:** November 2025