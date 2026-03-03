package com.rikkeisoft.backend.service.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.rikkeisoft.backend.enums.AccountStatus;
import com.rikkeisoft.backend.enums.ErrorCode;
import com.rikkeisoft.backend.exception.AppException;
import com.rikkeisoft.backend.model.dto.req.auth.AuthenticationReq;
import com.rikkeisoft.backend.model.dto.req.auth.LogoutReq;
import com.rikkeisoft.backend.model.dto.req.auth.TokenValidateReq;
import com.rikkeisoft.backend.model.dto.resp.auth.AuthenticationResp;
import com.rikkeisoft.backend.model.dto.resp.auth.TokenValidateResp;
import com.rikkeisoft.backend.model.entity.Account;
import com.rikkeisoft.backend.model.entity.InvalidatedToken;
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.repository.InvalidatedTokenRepo;
import com.rikkeisoft.backend.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    AccountRepo accountRepo;
    InvalidatedTokenRepo invalidatedTokenRepo;

    /**
     * Authenticate a user with username and password.
     * @param req
     * @return AuthenticationResp containing authentication status and JWT token.
     */
    public AuthenticationResp authenticate(AuthenticationReq req) {
        var user = accountRepo.findByUsername(req.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        // Check if the provided password matches the stored password
        boolean authenticated = passwordEncoder.matches(req.getPassword(), user.getPassword());

        // Consider authentication result to generate a JWT token or handle further logic
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Build the response object with authentication status and token
        String token = generateToken(user.getUsername());
        AuthenticationResp response = AuthenticationResp.builder()
                .accessToken(token) // Include the generated token in the resp
                .authenticated(authenticated) // always true if pass the exception check
                .build();
        return response;
    }

    /**
     * Generate a JWT token for the authenticated user.
     * @param username
     * @return JWT token as a string.
     */
    private String generateToken(String username) {
        // Create a JWSHeader with the desired algorithm
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        // define the claims for the JWT
        Set<String> roles = accountRepo.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND)).getRoles();
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .issuer("http://localhost:8080/headhunt")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(24, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(java.util.UUID.randomUUID().toString())
                .claim("scope", String.join(" ", roles))
                .build();

        // Create a payload with the claims
        Payload payload = new Payload(claimsSet.toJSONObject());

        // Create a JWSObject with the header and payload
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize(); // Serialize the JWS object to a compact string representation
        } catch (JOSEException e) {
            // announce the error
            System.err.println("Error generating JWT token: " + e.getMessage());
            throw new RuntimeException(e);
        }

    }

    /**
     * Introspect a JWT token to verify its validity and extract user information.
     * @param req
     * @return IntrospectResp containing token validity and user details.
     * @throws JOSEException
     * @throws ParseException
     */
    public TokenValidateResp validateToken(TokenValidateReq req)
            throws JOSEException, ParseException {
        var token = req.getToken();
        
        // Parse the token
        SignedJWT signedJWT = SignedJWT.parse(token);
        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        
        // Check if token is in blacklist
        if (jti != null && invalidatedTokenRepo.existsById(jti)) {
            log.warn("Token has been invalidated (logged out): {}", jti);
            return TokenValidateResp.builder()
                    .valid(false)
                    .build();
        }
        
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);
        AccountStatus status = accountRepo.findByUsername(signedJWT.getJWTClaimsSet().getSubject())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND)).getStatus();

        return TokenValidateResp.builder()
                .valid(verified && expiryTime.after(new Date()))
                .username(signedJWT.getJWTClaimsSet().getSubject())
                .id(accountRepo.findByUsername(signedJWT.getJWTClaimsSet().getSubject())
                        .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND)).getId().toString())
                .role(signedJWT.getJWTClaimsSet().getStringClaim("scope"))
                .status(status)
                .build();
    }

    /**
     * Logout user by invalidating the JWT token (add to blacklist)
     * @param req
     * @throws ParseException
     * @throws JOSEException
     */
    @Override
    public void logout(LogoutReq req) throws ParseException, JOSEException {
        String token = req.getToken();
        
        try {
            // Parse and verify the token
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            
            if (!signedJWT.verify(verifier)) {
                log.warn("Invalid token signature during logout");
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            
            // Extract token information
            String jti = signedJWT.getJWTClaimsSet().getJWTID();
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            
            // Use token itself as ID if no JTI
            String tokenId = (jti != null) ? jti : token;
            
            // Check if already invalidated
            if (invalidatedTokenRepo.existsById(tokenId)) {
                log.info("Token already invalidated: {}", tokenId);
                return;
            }
            
            // Add token to blacklist
            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(tokenId)
                    .expiryTime(expiryTime.toInstant())
                    .invalidatedAt(Instant.now())
                    .build();
            
            invalidatedTokenRepo.save(invalidatedToken);
            log.info("User logged out successfully. Token invalidated: {}", tokenId);
            
        } catch (ParseException | JOSEException e) {
            log.error("Error parsing token during logout: {}", e.getMessage());
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }
}
