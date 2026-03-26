package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.req.forum.ForumCategoryUpdateReq;
import com.rikkeisoft.backend.model.dto.resp.forum.ForumCategoryResp;
import com.rikkeisoft.backend.model.entity.ForumCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ForumCategoryMapper {
    ForumCategoryResp toForumCategoryResp (ForumCategory forumCategory);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "softDeleted", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateForumCategoryFromRequest(ForumCategoryUpdateReq req, @MappingTarget ForumCategory forumCategory);
}
