package com.rikkeisoft.backend.service;

/**
 * Service contract for managing news/forum posts used by the admin panel.
 *
 * Note: use fully-qualified DTO names here to avoid IDE resolution glitches
 * when the project index is stale. The implementation uses the concrete types
 * under `com.rikkeisoft.backend.model.dto`.
 */
public interface NewsService {

	com.rikkeisoft.backend.model.dto.resp.news.NewsPostResp createNews(
			com.rikkeisoft.backend.model.dto.req.news.NewsPostCreateReq req);

	com.rikkeisoft.backend.model.dto.resp.news.NewsPostResp updateNews(
			Long id, com.rikkeisoft.backend.model.dto.req.news.NewsPostUpdateReq req);

	com.rikkeisoft.backend.model.dto.resp.news.NewsPostResp getNews(Long id);
}
