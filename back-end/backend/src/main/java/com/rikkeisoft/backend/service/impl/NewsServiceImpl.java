package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.enums.PostStatus;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.mapper.NewsPostMapper;
import com.rikkeisoft.backend.model.dto.req.news.NewsPostCreateReq;
import com.rikkeisoft.backend.model.dto.req.news.NewsPostUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.news.NewsPostResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.ForumCategory;
import com.rikkeisoft.backend.model.entity.ForumPost;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.ForumCategoryRepo;
import com.rikkeisoft.backend.repository.ForumPostRepo;
import com.rikkeisoft.backend.service.NewsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NewsServiceImpl implements NewsService {

    ForumPostRepo forumPostRepo;
    ForumCategoryRepo forumCategoryRepo;
    AccountRepo accountRepo;
    NewsPostMapper newsPostMapper;

    @Override
    @Transactional
    public NewsPostResp createNews(NewsPostCreateReq req) {
        Account author = getCurrentAccount();
        ForumCategory category = getCategory(req.getCategoryId());
        ensureContentNotEmpty(req.getContent());

        ForumPost post = ForumPost.builder()
                .author(author)
                .category(category)
                .title(req.getTitle().trim())
                .shortDescription(trimToNull(req.getShortDescription()))
                .imageUrl(trimToNull(req.getImageUrl()))
                .content(req.getContent())
                .status(req.getStatus() == null ? PostStatus.DRAFT : req.getStatus())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        ForumPost saved = forumPostRepo.save(post);
        return newsPostMapper.toNewsPostResp(saved);
    }

    @Override
    @Transactional
    public NewsPostResp updateNews(Long id, NewsPostUpdateReq req) {
        ForumPost post = findNews(id);
        ForumCategory category = getCategory(req.getCategoryId());
        ensureContentNotEmpty(req.getContent());

        post.setTitle(req.getTitle().trim());
        post.setShortDescription(trimToNull(req.getShortDescription()));
        post.setImageUrl(trimToNull(req.getImageUrl()));
        post.setContent(req.getContent());
        post.setCategory(category);
        if (req.getStatus() != null) {
            post.setStatus(req.getStatus());
        }
        post.setUpdatedAt(LocalDateTime.now());

        return newsPostMapper.toNewsPostResp(post);
    }

    @Override
    @Transactional(readOnly = true)
    public NewsPostResp getNews(Long id) {
        ForumPost post = findNews(id);
        return newsPostMapper.toNewsPostResp(post);
    }

    private ForumPost findNews(Long id) {
        ForumPost post = forumPostRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NEWS_NOT_FOUND));
        if (post.getDeletedAt() != null) {
            throw new AppException(ErrorCode.NEWS_NOT_FOUND);
        }
        return post;
    }

    private ForumCategory getCategory(Long categoryId) {
        return (ForumCategory) forumCategoryRepo.findByIdAndSoftDeletedFalse(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private Account getCurrentAccount() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return accountRepo.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
    }

    private void ensureContentNotEmpty(String content) {
        if (content == null) {
            throw new AppException(ErrorCode.NEWS_CONTENT_REQUIRED);
        }
        String stripped = content
                .replaceAll("<[^>]*>", " ")
                .replace("&nbsp;", " ")
                .replace("\u00A0", " ")
                .trim();
        if (stripped.isEmpty()) {
            throw new AppException(ErrorCode.NEWS_CONTENT_REQUIRED);
        }
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
