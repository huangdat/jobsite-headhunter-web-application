package com.rikkeisoft.backend.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rikkeisoft.backend.component.Translator;
import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.PagedResponse;
import com.rikkeisoft.backend.model.dto.req.forumpost.ForumPostDetailResp;
import com.rikkeisoft.backend.model.dto.req.forumpost.ForumPostUpdateStatusReq;
import com.rikkeisoft.backend.model.dto.resp.forumpost.ForumPostResp;
import com.rikkeisoft.backend.service.ForumPostService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/forum/posts")
public class ForumPostController {

    ForumPostService forumPostService;
    Translator translator;

    // FOR-10: Search posts with pagination, keyword and category filter
    @GetMapping
    public APIResponse<PagedResponse<ForumPostResp>> searchPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long category) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<ForumPostResp> result = forumPostService.searchPosts(keyword, category, pageable);

        return APIResponse.<PagedResponse<ForumPostResp>>builder()
                .status(HttpStatus.OK)
                .message(translator.toLocale("post.list.fetched"))
                .result(result)
                .build();
    }

    // FOR-10: Get featured posts
    @GetMapping("/featured")
    public APIResponse<List<ForumPostResp>> getFeaturedPosts(
            @RequestParam(defaultValue = "4") int limit) {

        List<ForumPostResp> result = forumPostService.getFeaturedPosts(limit);

        return APIResponse.<List<ForumPostResp>>builder()
                .status(HttpStatus.OK)
                .message(translator.toLocale("post.featured.fetched"))
                .result(result)
                .build();
    }

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
            @PathVariable @Positive(message = "The post ID must be greater than 0.") Long id) {

        ForumPostDetailResp postDetail = forumPostService.getPostDetail(id);

        return APIResponse.<ForumPostDetailResp>builder()
                .status(HttpStatus.OK)
                .message(translator.toLocale("post.detail.fetched"))
                .result(postDetail)
                .build();
    }
}
