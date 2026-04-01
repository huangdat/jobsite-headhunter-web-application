package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.forumpost.ForumPostDetailResp;
import com.rikkeisoft.backend.model.dto.req.forumpost.ForumPostUpdateStatusReq;
import com.rikkeisoft.backend.model.dto.resp.forumpost.ForumPostResp;
import com.rikkeisoft.backend.service.ForumPostService;

import io.swagger.v3.oas.models.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rikkeisoft.backend.component.Translator;

import com.rikkeisoft.backend.model.dto.req.forumpost.ForumPostDetailResp;
import com.rikkeisoft.backend.service.ForumPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.Positive;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/forum/posts")
public class ForumPostController {

    ForumPostService forumPostService;
    private final Translator translator;

    @PatchMapping("/{id}/status")
    public APIResponse<ForumPostResp> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ForumPostUpdateStatusReq req) {

        ForumPostResp result = forumPostService.updateStatus(id, req.getStatus());

        return APIResponse.<ForumPostResp>builder()
                .status(HttpStatus.OK)
                .message("Post status updated successfully")
                .result(result)
                .build();
    }

    @DeleteMapping("/{id}")
    public APIResponse<Void> deletePost(@PathVariable Long id) {
        forumPostService.deletePost(id);
        return APIResponse.<Void>builder()
                .status(HttpStatus.OK)
                .message("Post deleted successfully")
                .build();
    }

    @GetMapping("/{id}")
    public APIResponse<ForumPostDetailResp> getPostDetail(
            @PathVariable @Positive(message = "ID bài viết phải lớn hơn 0") Long id) {

        ForumPostDetailResp postDetail = forumPostService.getPostDetail(id);

        return APIResponse.<ForumPostDetailResp>builder()
                .status(HttpStatus.OK)
                .message(translator.toLocale("post.detail.fetched"))
                .result(postDetail)
                .build();
    }
}
