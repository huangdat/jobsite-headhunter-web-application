package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.resp.news.NewsPostResp;
import com.rikkeisoft.backend.model.entity.ForumPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NewsPostMapper {

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    NewsPostResp toNewsPostResp(ForumPost post);
}
