package com.rikkeisoft.backend.model.dto.req.collaborator;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CollaboratorProfileCreateReq {
    String accountId;
    String managedByHeadhunterId;
    Double commissionRate;
}
