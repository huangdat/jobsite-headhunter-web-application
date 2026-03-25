package com.rikkeisoft.backend.component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class Translator {

    MessageSource messageSource;

    public String toLocale(String msgCode) {
        // Fetches message based on specific LocaleContext (set by Spring automatically)
        return messageSource.getMessage(msgCode, null, LocaleContextHolder.getLocale());
    }
}
