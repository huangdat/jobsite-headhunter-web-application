package com.rikkeisoft.backend.enums;

public enum SkillCategory {

    PROGRAMMING_LANGUAGES("Programming Languages"),
    FRONTEND_DEVELOPMENT("Frontend Development"),
    BACKEND_DEVELOPMENT("Backend Development"),
    DATABASES("Databases"),
    DEVOPS_AND_CLOUD("DevOps and Cloud"),
    TESTING("Testing"),
    VERSION_CONTROL("Version Control"),
    SOFTWARE_ARCHITECTURE_AND_CONCEPTS("Software Architecture and Concepts"),
    DATA_AND_AI("Data and AI");

    private final String displayName;


    SkillCategory(String displayName) {
        this.displayName = displayName;
    }
}