package com.rikkeisoft.backend.model.dto.resp.business;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MSTLookupResp {

    String companyName;

    String taxCode;

    String headquarterAddress;
}
