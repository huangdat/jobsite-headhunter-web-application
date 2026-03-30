package com.rikkeisoft.backend.controller;

import com.rikkeisoft.backend.model.dto.APIResponse;
import com.rikkeisoft.backend.model.dto.req.forumpost.ForumPostUpdateStatusReq;
import com.rikkeisoft.backend.model.dto.resp.forumpost.ForumPostResp;
import com.rikkeisoft.backend.service.ForumPostService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/api/forum/posts")
public class ForumPostController {

    ForumPostService forumPostService;

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
}
