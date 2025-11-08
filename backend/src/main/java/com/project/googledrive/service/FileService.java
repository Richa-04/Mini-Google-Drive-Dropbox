package com.project.googledrive.service;

import com.project.googledrive.model.FileMetadata;
import com.project.googledrive.repository.FileRepository;
import com.project.googledrive.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {
    
    private final FileRepository fileRepository;
    private static final String UPLOAD_DIR = "uploads/";
    
    public FileMetadata uploadFile(MultipartFile file, String ownerEmail) throws Exception {
        // Create uploads directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        
        // Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
        String filePath = UPLOAD_DIR + fileName;
        
        // Generate encryption key
        String encryptionKey = EncryptionUtil.generateKey();
        
        // Encrypt and save file
        byte[] fileData = file.getBytes();
        byte[] encryptedData = EncryptionUtil.encrypt(fileData, encryptionKey);
        
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(encryptedData);
        }
        
        // Save metadata to database
        FileMetadata metadata = new FileMetadata();
        metadata.setFileName(fileName);
        metadata.setOriginalFileName(originalFileName);
        metadata.setFileType(file.getContentType());
        metadata.setFileSize(file.getSize());
        metadata.setFilePath(filePath);
        metadata.setOwnerEmail(ownerEmail);
        metadata.setUploadedAt(LocalDateTime.now());
        metadata.setEncryptionKey(encryptionKey);
        
        return fileRepository.save(metadata);
    }
    
    // For file sharing
    
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
        
        // Read encrypted file
        Path path = Paths.get(metadata.getFilePath());
        byte[] encryptedData = Files.readAllBytes(path);
        
        // Decrypt and return
        return EncryptionUtil.decrypt(encryptedData, metadata.getEncryptionKey());
    }
    
    public void deleteFile(String fileId) throws Exception {
        FileMetadata metadata = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        // Delete physical file
        File file = new File(metadata.getFilePath());
        if (file.exists()) {
            file.delete();
        }
        
        // Delete metadata from database
        fileRepository.deleteById(fileId);
    }

    // For file sharing
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
            .collect(java.util.stream.Collectors.toList());
}
}