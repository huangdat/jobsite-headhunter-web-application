package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.constant.SecurityConstants;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.news.NewsPostCreateReq;
import com.rikkeisoft.backend.model.dto.req.news.NewsPostUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.news.NewsPostResp;
import com.rikkeisoft.backend.model.dto.resp.news.UploadImageResp;
import com.rikkeisoft.backend.service.NewsService;
import com.rikkeisoft.backend.service.UploadService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/news")
public class NewsController {

    static long MAX_IMAGE_BYTES = 5L * 1024 * 1024;

    NewsService newsService;
    UploadService uploadService;

    @PostMapping("/upload-image")
    @PreAuthorize(SecurityConstants.ADMIN)
    public APIResponse<UploadImageResp> uploadImage(@RequestParam("file") MultipartFile file) {
        validateImage(file);
        String url = uploadService.uploadFile(file);
        return APIResponse.<UploadImageResp>builder()
                .status(HttpStatus.OK)
                .result(UploadImageResp.builder().url(url).build())
                .build();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize(SecurityConstants.ADMIN)
    public APIResponse<NewsPostResp> createNews(@Valid @RequestBody NewsPostCreateReq req) {
        NewsPostResp result = newsService.createNews(req);
        return APIResponse.<NewsPostResp>builder()
                .status(HttpStatus.CREATED)
                .result(result)
                .build();
    }

        @PutMapping("/{id}")
        @PreAuthorize(SecurityConstants.ADMIN)
        public APIResponse<NewsPostResp> updateNews(
            @PathVariable Long id,
            @Valid @RequestBody NewsPostUpdateReq req) {
        NewsPostResp result = newsService.updateNews(id, req);
        return APIResponse.<NewsPostResp>builder()
                .status(HttpStatus.OK)
                .result(result)
                .build();
    }

    @GetMapping("/{id}")
    public APIResponse<NewsPostResp> getNews(@PathVariable Long id) {
        NewsPostResp result = newsService.getNews(id);
        return APIResponse.<NewsPostResp>builder()
                .status(HttpStatus.OK)
                .result(result)
                .build();
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.NEWS_IMAGE_INVALID);
        }
        if (file.getSize() > MAX_IMAGE_BYTES) {
            throw new AppException(ErrorCode.NEWS_IMAGE_TOO_LARGE);
        }
        String original = file.getOriginalFilename();
        if (original == null || !original.contains(".")) {
            throw new AppException(ErrorCode.NEWS_IMAGE_INVALID);
        }
        String ext = original.substring(original.lastIndexOf('.') + 1).toLowerCase();
        if (!(ext.equals("jpg") || ext.equals("jpeg") || ext.equals("png") || ext.equals("gif") || ext.equals("webp"))) {
            throw new AppException(ErrorCode.NEWS_IMAGE_INVALID);
        }
    }
}
