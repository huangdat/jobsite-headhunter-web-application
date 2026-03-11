package com.rikkeisoft.backend.model.dto.req.collaborator;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CollaboratorUpdateCommissionReq {
    @NotNull(message = "COMMISSION_RATE_NULL")
    @Min(value = 0, message = "COMMISSION_RATE_MIN")
    @Max(value = 100, message = "COMMISSION_RATE_MAX")
    Double commissionRate;
}
