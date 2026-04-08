package com.rikkeisoft.backend.enums;

public enum ApplicationSortField {
    APPLIED_AT("appliedAt"),
    STATUS("status"),
    SALARY_EXPECTATION("salaryExpectation");

    private final String fieldName;

    ApplicationSortField(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
