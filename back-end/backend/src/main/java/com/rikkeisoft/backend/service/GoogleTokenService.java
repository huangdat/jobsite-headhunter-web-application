package com.rikkeisoft.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

public interface GoogleTokenService {
    GoogleIdToken.Payload verifyToken(String idToken);
}
