package com.rikkeisoft.backend.config;

import com.rikkeisoft.backend.repository.InvalidatedTokenRepo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenInvalidationFilter extends OncePerRequestFilter {
    private final InvalidatedTokenRepo invalidatedTokenRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        // don't block authentication endpoints (login, token-validate, logout)
        if (path != null && path.contains("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length()).trim();
            try {
                if (token != null && !token.isBlank() && invalidatedTokenRepo.existsById(token)) {
                    log.debug("Rejected request with invalidated token");
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"message\":\"Token invalidated\"}");
                    return;
                }
            } catch (Exception e) {
                log.error("Error checking token invalidation", e);
            }
        }

        filterChain.doFilter(request, response);
    }
}
