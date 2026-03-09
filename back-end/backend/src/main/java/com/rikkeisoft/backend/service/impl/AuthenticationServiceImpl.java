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
import com.rikkeisoft.backend.repository.AccountRepo;
import com.rikkeisoft.backend.model.entity.InvalidatedToken;
import com.rikkeisoft.backend.repository.InvalidatedTokenRepo;
import com.rikkeisoft.backend.service.AuthenticationService;
import com.rikkeisoft.backend.service.GoogleTokenService;
import com.rikkeisoft.backend.model.dto.req.auth.GoogleTokenReq;
import com.rikkeisoft.backend.model.dto.req.auth.SocialRegisterReq;
import com.rikkeisoft.backend.model.dto.resp.auth.SocialAuthResp;
import com.rikkeisoft.backend.enums.AuthProvider;
import com.rikkeisoft.backend.model.dto.req.auth.LinkedInTokenReq;
import com.rikkeisoft.backend.model.dto.resp.auth.LinkedInTokenResp;
import com.rikkeisoft.backend.model.dto.resp.auth.LinkedInUserInfoResp;
import com.rikkeisoft.backend.service.LinkedInTokenService;
import com.rikkeisoft.backend.repository.CandidateProfileRepo;
import com.rikkeisoft.backend.repository.BusinessProfileRepo;
import com.rikkeisoft.backend.repository.CollaboratorProfileRepo;
import com.rikkeisoft.backend.model.entity.CandidateProfile;
import com.rikkeisoft.backend.model.entity.BusinessProfile;
import com.rikkeisoft.backend.model.entity.CollaboratorProfile;
import com.rikkeisoft.backend.enums.Role;
import com.rikkeisoft.backend.enums.VerificationStatus;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    AccountRepo accountRepo;
    InvalidatedTokenRepo invalidatedTokenRepo;
    GoogleTokenService googleTokenService;
    LinkedInTokenService linkedInTokenService;
    CandidateProfileRepo candidateProfileRepo;
    BusinessProfileRepo businessProfileRepo;
    CollaboratorProfileRepo collaboratorProfileRepo;

    /**
     * Authenticate a user with username and password.
     * 
     * @param req
     * @return AuthenticationResp containing authentication status and JWT token.
     */
    public AuthenticationResp authenticate(AuthenticationReq req) {
        var user = accountRepo.findByUsername(req.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        // Check if the provided password matches the stored password
        boolean authenticated = passwordEncoder.matches(req.getPassword(), user.getPassword());

        // Consider authentication result to generate a JWT token or handle further
        // logic
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Build the response object with authentication status and token
        String token = generateToken(user.getUsername(), false);
        String refreshToken = generateToken(user.getUsername(), true);
        AuthenticationResp response = AuthenticationResp.builder()
                .accessToken(token) // Include the generated token in the resp
                .refreshToken(refreshToken)
                .authenticated(authenticated) // always true if pass the exception check
                .build();
        return response;
    }

    /**
     * Generate a JWT token for the authenticated user.
     * 
     * @param username
     * @param isRefreshToken
     * @return JWT token as a string.
     */
    private String generateToken(String username, boolean isRefreshToken) {
        // Create a JWSHeader with the desired algorithm
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        // define the claims for the JWT
        JWTClaimsSet.Builder claimsBuilder = new JWTClaimsSet.Builder()
                .subject(username)
                .issuer("http://localhost:8080/headhunt")
                .issueTime(new Date());

        if (isRefreshToken) {
            claimsBuilder.expirationTime(new Date(
                    Instant.now().plus(7, ChronoUnit.DAYS).toEpochMilli())).claim("scope", "REFRESH_TOKEN");
        } else {
            Set<String> roles = accountRepo.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND)).getRoles();
            claimsBuilder.expirationTime(new Date(
                    Instant.now().plus(24, ChronoUnit.HOURS).toEpochMilli())).claim("scope", String.join(" ", roles));
        }

        JWTClaimsSet claimsSet = claimsBuilder.build();

        // Create a payload with the claims
        Payload payload = new Payload(claimsSet.toJSONObject());

        // Create a JWSObject with the header and payload
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize(); // Serialize the JWS object to a compact string representation
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }

    }

    /**
     * Introspect a JWT token to verify its validity and extract user information.
     * 
     * @param req
     * @return IntrospectResp containing token validity and user details.
     * @throws JOSEException
     * @throws ParseException
     */
    public TokenValidateResp validateToken(TokenValidateReq req)
            throws JOSEException, ParseException {
        var token = req.getToken();
        // If token was invalidated (user logged out), consider it invalid immediately
        if (invalidatedTokenRepo.existsById(token)) {
            return TokenValidateResp.builder()
                    .valid(false)
                    .username(null)
                    .id(null)
                    .role(null)
                    .status(null)
                    .build();
        }
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
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

    @Override
    public void logout(LogoutReq req) throws ParseException, JOSEException {
        var token = req.getToken();
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiry = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken inv = InvalidatedToken.builder()
                .id(token)
                .expiryTime(expiry.toInstant())
                .invalidatedAt(Instant.now())
                .build();

        invalidatedTokenRepo.save(inv);
    }

    @Override
    @Transactional
    public Object googleLogin(GoogleTokenReq req) {
        var googlePayload = googleTokenService.verifyToken(req.getIdToken());
        String email = googlePayload.getEmail();
        if (email == null || email.isEmpty()) {
            throw new AppException(ErrorCode.EMAIL_REQUIRED);
        }
        String providerId = googlePayload.getSubject();
        String name = (String) googlePayload.get("name");
        String picture = (String) googlePayload.get("picture");

        var accountOptional = accountRepo.findByEmail(email);

        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            // Update provider info if missing or different (though usually same email means
            // same person)
            boolean changed = false;
            if (account.getAuthProvider() == null) {
                account.setAuthProvider(AuthProvider.GOOGLE);
                changed = true;
            }
            if (account.getProviderId() == null) {
                account.setProviderId(providerId);
                changed = true;
            }
            if (picture != null && account.getImageUrl() == null) {
                account.setImageUrl(picture);
                changed = true;
            }

            if (changed) {
                accountRepo.save(account);
            }

            String token = generateToken(account.getUsername(), false);
            String refreshToken = generateToken(account.getUsername(), true);
            return AuthenticationResp.builder()
                    .accessToken(token)
                    .refreshToken(refreshToken)
                    .authenticated(true)
                    .build();
        } else {
            return SocialAuthResp.builder()
                    .email(email)
                    .provider(AuthProvider.GOOGLE)
                    .providerId(providerId)
                    .fullName(name)
                    .imageUrl(picture)
                    .build();
        }
    }

    @Override
    @Transactional
    public Object linkedinLogin(LinkedInTokenReq req) {
        LinkedInTokenResp tokenResp = linkedInTokenService.getAccessToken(req);
        LinkedInUserInfoResp userInfo = linkedInTokenService.getUserInfo(tokenResp.getAccessToken());

        String email = userInfo.getEmail();
        if (email == null || email.isEmpty()) {
            throw new AppException(ErrorCode.EMAIL_REQUIRED);
        }
        String providerId = userInfo.getSub();
        String name = userInfo.getName();
        String picture = userInfo.getPicture();

        var accountOptional = accountRepo.findByEmail(email);

        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            boolean changed = false;

            if (account.getAuthProvider() == null) {
                account.setAuthProvider(AuthProvider.LINKEDIN);
                changed = true;
            }
            if (account.getProviderId() == null) {
                account.setProviderId(providerId);
                changed = true;
            }
            if (picture != null && account.getImageUrl() == null) {
                account.setImageUrl(picture);
                changed = true;
            }

            if (changed) {
                accountRepo.save(account);
            }

            String token = generateToken(account.getUsername(), false);
            String refreshToken = generateToken(account.getUsername(), true);
            return AuthenticationResp.builder()
                    .accessToken(token)
                    .refreshToken(refreshToken)
                    .authenticated(true)
                    .build();
        } else {
            return SocialAuthResp.builder()
                    .email(email)
                    .provider(AuthProvider.LINKEDIN)
                    .providerId(providerId)
                    .fullName(name)
                    .imageUrl(picture)
                    .build();
        }
    }

    @Override
    @Transactional
    public AuthenticationResp registerSocial(SocialRegisterReq req) {
        if (accountRepo.existsByEmail(req.getEmail())) {
            throw new AppException(ErrorCode.CONFLICT);
        }

        // Generate unique username
        String baseUsername = req.getEmail().split("@")[0];
        String username = baseUsername;
        Random random = new Random();
        while (accountRepo.existsByUsername(username)) {
            username = baseUsername + (1000 + random.nextInt(9000));
        }

        Account account = Account.builder()
                .email(req.getEmail())
                .username(username)
                .fullName(req.getFullName())
                .imageUrl(req.getImageUrl())
                .authProvider(req.getProvider())
                .providerId(req.getProviderId())
                .status(AccountStatus.ACTIVE)
                .roles(new HashSet<>(Collections.singletonList(req.getRole().name())))
                .build();

        account = accountRepo.save(account);

        // Create profile based on role
        if (req.getRole() == Role.CANDIDATE) {
            CandidateProfile profile = CandidateProfile.builder()
                    .account(account)
                    .openForWork(true)
                    .build();
            candidateProfileRepo.save(profile);
        } else if (req.getRole() == Role.HEADHUNTER) {
            BusinessProfile profile = BusinessProfile.builder()
                    .account(account)
                    .companyName("Company of " + account.getFullName()) // Placeholder
                    .verificationStatus(VerificationStatus.PENDING)
                    .build();
            businessProfileRepo.save(profile);
        } else if (req.getRole() == Role.COLLABORATOR) {
            CollaboratorProfile profile = CollaboratorProfile.builder()
                    .account(account)
                    .build();
            collaboratorProfileRepo.save(profile);
        }

        String token = generateToken(account.getUsername(), false);
        String refreshToken = generateToken(account.getUsername(), true);
        return AuthenticationResp.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }
}
