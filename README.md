# Mini Google Drive - Dropbox
**Smart Document Management System with AI Search**

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)]()
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)]()
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)]()

---

## 📋 Table of Contents
- [Overview](#overview)
- [Background](#background)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Expected Outcomes](#expected-outcomes)
- [Getting Started](#getting-started)
- [Project Status](#project-status)
- [Team](#team)
- [License](#license)

---

## 🌟 Overview

Mini Google Drive - Dropbox is a cloud-based document management system that combines secure file storage with AI-powered semantic search capabilities. This system aims to solve common document management challenges by providing intelligent search, enterprise-grade security, and seamless file organization.

---

## 📊 Background

### Document Management Challenges

- **72%** of enterprises globally have adopted digital document management systems
- **2 hours/day** spent searching for information
- **46%** of workers struggle to find needed documents

### Target Users

| User Group | Use Case |
|------------|----------|
| **Corporate Teams** | Project collaboration & knowledge sharing |
| **Students & Researchers** | Academic paper management |
| **Remote Workers** | Accessible file management across devices |
| **Legal & Healthcare** | Secure document storage with quick retrieval |

---

## ✨ Key Features

### 🔐 Core Deliverables
- ✅ Folder organization & management
- ✅ Secure authentication system (JWT)
- ✅ File upload/download with encryption
- ✅ Traditional keyword search
- ✅ View and delete files functionality

### 🤖 Advanced AI Features
- ⭐ **Semantic Search**: Natural language queries like "Find documents about project deadlines"
- ⭐ **Smart Categorization**: Automatic document tagging and classification
- ⭐ **Context-Aware Search**: Understanding beyond simple keywords

### 🛡️ Security Features
- End-to-end AES file encryption
- JWT-based authentication
- Secure cloud storage integration

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Java, Spring Boot
- **Database**: MongoDB
- **Cloud Storage**: AWS S3
- **Security**: AES Encryption, JWT

### Frontend
- **Framework**: ReactJS
- **UI/UX**: Modern, intuitive interface design

### AI/ML Components
- **NLP Engine**: Natural Language Processing
- **Search**: OpenAI API for semantic search
- **Intelligence**: Smart document categorization

---

## 🏗️ Architecture
```
┌─────────┐      ┌──────────────┐      ┌────────────────┐      ┌──────────┐
│   User  │ ───> │  Spring Boot │ ───> │ AI Search      │ ───> │  AWS S3  │
│   Web   │      │     API      │      │    Engine      │      │  Cloud   │
└─────────┘      └──────────────┘      └────────────────┘      └──────────┘
```

### System Pipeline

**Input**
- User uploads documents (PDF, DOCX, TXT)
- Natural language queries ("Let's find that doc...")

**Processing Systems**
- 🔐 **Authentication Layer**: JWT tokens, secure login
- 🔒 **Encryption Module**: AES file encryption
- ☁️ **Cloud Storage**: AWS S3
- 🗄️ **Database**: MongoDB
- 🤖 **AI Search Engine**: NLP, Semantic Search

**Output**
- Securely stored files
- Intelligent semantic search results

---

## 🎯 Expected Outcomes

### 🔐 Secure
Enterprise-grade encryption and authentication for all file operations

### ⚡ Intelligent
AI-powered semantic search that understands context and intent

### 📈 Scalable
Cloud-native architecture designed to handle millions of files

---

## 🚀 Getting Started

> **Note**: This project is currently in the planning and design phase. Implementation will begin soon.

### Prerequisites
```bash
# Prerequisites will be added once implementation begins
- Java 17+
- Node.js 16+
- MongoDB
- AWS Account (for S3)
```

### Installation
```bash
# Installation instructions will be provided in future updates
```

---

## 📌 Project Status

🚧 **Status**: Planning & Design Phase

This is Phase 1 of the final project for **INFO 5100: Application Engineering and Development** (Fall 2025).

### Roadmap
- [ ] Phase 1: Requirements & Design ✅ (Current)
- [ ] Phase 2: Backend Development
- [ ] Phase 3: Frontend Development
- [ ] Phase 4: AI Integration
- [ ] Phase 5: Testing & Deployment

---

## 👥 Team

- **Richa Padhariya** - NUID: 002542349
- **Neha Kumari** - NUID: 003158473

**Course**: INFO 5100: Application Engineering and Development  
**Semester**: Fall 2025  
**Project**: Final Project - Phase 1

---

## 📚 References

1. Global Growth Insights. "Electronic Document Management System Market Size [2033]." 2025.
2. FileCenter. "100 Document Management Statistics to Make You Rethink Your Processes in 2025." 2025.
3. Foxit Software. "Just the Numbers: 10 Document Management Stats You Need to Know." Foxit Blog, 2024.

---

## 📄 License

This project is being developed as part of an academic course at Northeastern University.

---

## 🤝 Contributing

This is an academic project. Contributions are currently limited to team members.

---

## 📞 Contact

For questions or feedback about this project, please contact the team members through official university channels.

---

<div align="center">
  
**Built with ❤️ for INFO 5100 Final Project**

</div>
