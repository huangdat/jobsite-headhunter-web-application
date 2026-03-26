package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.resp.forum.ForumCategoryResp;
import com.rikkeisoft.backend.model.entity.ForumCategory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ForumCategoryMapper {
    ForumCategoryResp toForumCategoryResp (ForumCategory forumCategory);
}
