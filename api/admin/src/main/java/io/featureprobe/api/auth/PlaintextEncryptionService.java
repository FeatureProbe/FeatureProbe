package io.featureprobe.api.auth;

import io.featureprobe.api.base.security.IEncryptionService;
import org.springframework.stereotype.Component;

@Component("plaintext")
public class PlaintextEncryptionService implements IEncryptionService {

    @Override
    public String encrypt(String content) {
        return content;
    }

    @Override
    public String decrypt(String encryptContent) {
        return encryptContent;
    }

}
