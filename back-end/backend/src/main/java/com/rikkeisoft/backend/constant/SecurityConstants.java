package com.rikkeisoft.backend.constant;

public final class SecurityConstants {

    private SecurityConstants() {
        // Prevent instantiation
    }

    // ==========================================
    // Single Roles
    // ==========================================
    public static final String ADMIN = "hasAuthority('SCOPE_ADMIN')";
    public static final String HEADHUNTER = "hasAuthority('SCOPE_HEADHUNTER')";
    public static final String COLLABORATOR = "hasAuthority('SCOPE_COLLABORATOR')";
    public static final String CANDIDATE = "hasAuthority('SCOPE_CANDIDATE')";

    // ==========================================
    // Combinations of 2 Roles
    // ==========================================
    public static final String ADMIN_OR_HEADHUNTER = "hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_HEADHUNTER')";
    public static final String ADMIN_OR_COLLABORATOR = "hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_COLLABORATOR')";
    public static final String HEADHUNTER_OR_COLLABORATOR = "hasAnyAuthority('SCOPE_HEADHUNTER', 'SCOPE_COLLABORATOR')";

    // ==========================================
    // Combinations of 3 Roles
    // ==========================================
    public static final String ADMIN_OR_HEADHUNTER_OR_COLLABORATOR = "hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_HEADHUNTER', 'SCOPE_COLLABORATOR')";

}
