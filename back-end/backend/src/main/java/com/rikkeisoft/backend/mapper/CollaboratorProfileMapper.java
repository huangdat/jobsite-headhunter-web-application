package com.rikkeisoft.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.rikkeisoft.backend.model.dto.resp.collaborator.CollaboratorProfileResp;
import com.rikkeisoft.backend.model.entity.CollaboratorProfile;

@Mapper(componentModel = "spring")
public interface CollaboratorProfileMapper {

    @Mapping(source = "account.id", target = "accountId")
    @Mapping(source = "managedByHeadhunter.id", target = "managedByHeadhunterId")
    CollaboratorProfileResp toResponse(CollaboratorProfile collaboratorProfile);

    @Mapping(source = "accountId", target = "account.id")
    @Mapping(source = "managedByHeadhunterId", target = "managedByHeadhunter.id")
    CollaboratorProfile toCollaboratorProfile(CollaboratorProfileResp collaboratorProfileResp);
}
