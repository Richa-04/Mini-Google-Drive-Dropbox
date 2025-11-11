package com.project.googledrive.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.project.googledrive.model.FileMetadata;
import com.project.googledrive.repository.FileRepository;
import com.project.googledrive.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileService {
    
    private final FileRepository fileRepository;
    private final AmazonS3 amazonS3;
    private final OpenAIService openAIService;
    
    @Value("${aws.s3.bucket.name}")
    private String bucketName;
    
    private final Tika tika = new Tika();
    
    public FileMetadata uploadFile(MultipartFile file, String ownerEmail) throws Exception {
        // Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
        
        // Generate encryption key
        String encryptionKey = EncryptionUtil.generateKey();
        
        // Encrypt file data
        byte[] fileData = file.getBytes();
        byte[] encryptedData = EncryptionUtil.encrypt(fileData, encryptionKey);
        
        // Prepare S3 metadata
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(encryptedData.length);
        metadata.setContentType(file.getContentType());
        
        // Upload to S3
        ByteArrayInputStream inputStream = new ByteArrayInputStream(encryptedData);
        PutObjectRequest putObjectRequest = new PutObjectRequest(
                bucketName, 
                fileName, 
                inputStream, 
                metadata
        );
        
        amazonS3.putObject(putObjectRequest);
        
        // NEW: Generate embedding for text-based files only
        List<Double> embedding = null;
        if (isTextBasedFile(file.getContentType())) {
            try {
                String extractedText = extractText(fileData, file.getContentType());
                if (extractedText != null && !extractedText.trim().isEmpty()) {
                    // Limit text to first 8000 characters to avoid token limits
                    String textForEmbedding = extractedText.length() > 8000 
                        ? extractedText.substring(0, 8000) 
                        : extractedText;
                    embedding = openAIService.generateEmbedding(textForEmbedding);
                    System.out.println("✅ Generated embedding for: " + originalFileName);
                }
            } catch (Exception e) {
                System.err.println("Failed to generate embedding for " + originalFileName + ": " + e.getMessage());
                // Continue without embedding - file still uploads successfully
            }
        }
        
        // Save metadata to database
        FileMetadata fileMetadata = new FileMetadata();
        fileMetadata.setFileName(fileName);
        fileMetadata.setOriginalFileName(originalFileName);
        fileMetadata.setFileType(file.getContentType());
        fileMetadata.setFileSize(file.getSize());
        fileMetadata.setFilePath("s3://" + bucketName + "/" + fileName);
        fileMetadata.setOwnerEmail(ownerEmail);
        fileMetadata.setUploadedAt(LocalDateTime.now());
        fileMetadata.setEncryptionKey(encryptionKey);
        fileMetadata.setEmbedding(embedding);
        
        return fileRepository.save(fileMetadata);
    }
    
    // NEW: Check if file is text-based (for embedding generation)
    private boolean isTextBasedFile(String contentType) {
        return contentType != null && (
            contentType.contains("pdf") ||
            contentType.contains("text") ||
            contentType.contains("document") ||
            contentType.contains("msword") ||
            contentType.contains("officedocument")
        );
    }
    
    // NEW: Extract text from files using Apache Tika
    private String extractText(byte[] fileData, String contentType) {
        try {
            String text = tika.parseToString(new ByteArrayInputStream(fileData));
            return text != null ? text.trim() : "";
        } catch (Exception e) {
            System.err.println("Text extraction failed: " + e.getMessage());
            return "";
        }
    }
    
    // NEW: Semantic search using OpenAI embeddings
    public List<FileMetadata> searchBySemanticQuery(String query, String userEmail) throws Exception {
        // Generate embedding for the search query
        List<Double> queryEmbedding = openAIService.generateEmbedding(query);
        
        // Get all user's files
        List<FileMetadata> allFiles = getUserFiles(userEmail);
        
        // Calculate similarity scores and return top matches
        class FileWithScore {
            FileMetadata file;
            double score;
            FileWithScore(FileMetadata file, double score) {
                this.file = file;
                this.score = score;
            }
        }
        
        return allFiles.stream()
                .filter(file -> file.getEmbedding() != null && !file.getEmbedding().isEmpty())
                .map(file -> new FileWithScore(file, openAIService.calculateSimilarity(queryEmbedding, file.getEmbedding())))
                .filter(item -> item.score > 0.5) // Only return results with >50% similarity
                .sorted((a, b) -> Double.compare(b.score, a.score)) // Sort by relevance
                .limit(20)
                .map(item -> item.file)
                .collect(Collectors.toList());
    }
    
    public List<FileMetadata> getUserFiles(String ownerEmail) {
        // Get files owned by user
        List<FileMetadata> ownedFiles = fileRepository.findByOwnerEmail(ownerEmail);
        
        // Get files shared with user
        List<FileMetadata> sharedFiles = getSharedFiles(ownerEmail);
        
        // Combine both lists
        ownedFiles.addAll(sharedFiles);
        
        return ownedFiles;
    }
    
    public byte[] downloadFile(String fileId) throws Exception {
        FileMetadata metadata = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        // Download from S3
        S3Object s3Object = amazonS3.getObject(bucketName, metadata.getFileName());
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        byte[] encryptedData = inputStream.readAllBytes();
        inputStream.close();
        
        // Decrypt and return
        return EncryptionUtil.decrypt(encryptedData, metadata.getEncryptionKey());
    }
    
    public void deleteFile(String fileId) throws Exception {
        FileMetadata metadata = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        // Delete from S3
        amazonS3.deleteObject(bucketName, metadata.getFileName());
        
        // Delete metadata from database
        fileRepository.deleteById(fileId);
    }

    public FileMetadata shareFile(String fileId, String shareWithEmail, String ownerEmail) throws Exception {
        FileMetadata metadata = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        // Check if the requester is the owner
        if (!metadata.getOwnerEmail().equals(ownerEmail)) {
            throw new RuntimeException("You don't have permission to share this file");
        }
        
        // Check if already shared with this user
        if (metadata.getSharedWith().contains(shareWithEmail)) {
            throw new RuntimeException("File already shared with this user");
        }
        
        // Add to shared list
        metadata.getSharedWith().add(shareWithEmail);
        
        return fileRepository.save(metadata);
    }

    public List<FileMetadata> getSharedFiles(String userEmail) {
        return fileRepository.findAll().stream()
                .filter(file -> file.getSharedWith().contains(userEmail))
                .collect(Collectors.toList());
    }
    
    // Rename File
    public FileMetadata renameFile(String fileId, String newFileName, String userEmail) throws Exception {
        FileMetadata metadata = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        // Check if user is the owner
        if (!metadata.getOwnerEmail().equals(userEmail)) {
            throw new RuntimeException("You don't have permission to rename this file");
        }
        
        // Update the original file name
        metadata.setOriginalFileName(newFileName);
        
        return fileRepository.save(metadata);
    }
}