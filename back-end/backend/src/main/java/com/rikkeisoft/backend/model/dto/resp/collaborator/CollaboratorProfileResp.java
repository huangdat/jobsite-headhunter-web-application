package com.rikkeisoft.backend.model.dto.resp.collaborator;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CollaboratorProfileResp {
    Long id;
    String accountId;
    String managedByHeadhunterId;
    Double commissionRate;
}
