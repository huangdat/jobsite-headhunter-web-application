package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.resp.news.NewsPostResp;
import com.rikkeisoft.backend.model.entity.ForumPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NewsPostMapper {

    @Mapping(source = "forumCategory.id", target = "categoryId")
    @Mapping(source = "forumCategory.name", target = "categoryName")
    NewsPostResp toNewsPostResp(ForumPost post);
}
