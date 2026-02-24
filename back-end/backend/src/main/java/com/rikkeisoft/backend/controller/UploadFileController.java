package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.service.UploadService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/upload")
public class UploadFileController {
    @Autowired
    UploadService uploadService;

    @PostMapping
    public APIResponse<String> uploadFile(@RequestParam MultipartFile file) {
        APIResponse<String> response = new APIResponse<>();
        String fileUrl = uploadService.uploadFile(file);
        response.setResult(fileUrl);
        return response;
    }
}
