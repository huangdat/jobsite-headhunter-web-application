package com.rikkeisoft.backend.service.impl;

import com.rikkeisoft.backend.service.BusinessProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor // Generates a constructor with required arguments for final fields.
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class BusinessProfileServiceImpl implements BusinessProfileService {

}
