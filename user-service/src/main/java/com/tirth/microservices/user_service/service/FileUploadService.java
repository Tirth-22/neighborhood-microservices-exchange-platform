package com.tirth.microservices.user_service.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {

    String uploadProfileImage(Long userId, MultipartFile file);
}
