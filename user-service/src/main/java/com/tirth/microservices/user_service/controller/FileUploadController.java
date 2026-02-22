package com.tirth.microservices.user_service.controller;

import com.tirth.microservices.user_service.dto.ApiResponse;
import com.tirth.microservices.user_service.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/{id}/upload-profile")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Uploading profile image for user: {}", id);
        String imageUrl = fileUploadService.uploadProfileImage(id, file);
        Map<String, String> response = Map.of("profileImageUrl", imageUrl);
        return ResponseEntity.ok(new ApiResponse<>(true, response, "Profile image uploaded successfully"));
    }
}
