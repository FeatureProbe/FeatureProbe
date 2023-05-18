package io.featureprobe.api.base.security;

public interface IEncryptionService {

    String encrypt(String content);

    String decrypt(String encryptContent);

}
