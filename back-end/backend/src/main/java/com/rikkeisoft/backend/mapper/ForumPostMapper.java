package com.rikkeisoft.backend.mapper;

import com.rikkeisoft.backend.model.dto.resp.forumpost.ForumPostResp;
import com.rikkeisoft.backend.model.entity.ForumPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ForumPostMapper {

    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "author.username", target = "authorUsername")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "job.id", target = "jobId")
    ForumPostResp toForumPostResp(ForumPost forumPost);
}
