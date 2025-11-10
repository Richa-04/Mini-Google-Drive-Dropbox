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
    
    @Value("${aws.s3.bucket.name}")
    private String bucketName;
    
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
        
        return fileRepository.save(fileMetadata);
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
}