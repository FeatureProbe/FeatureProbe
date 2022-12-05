package com.featureprobe.api.auth;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.security.Key;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Slf4j
@Configuration
@Getter
public class JwtConfiguration {

    @Value("${app.security.jwt.keystore-location}")
    private String keyStorePath;

    @Value("${app.security.jwt.keystore-password}")
    private String keyStorePassword;

    @Value("${app.security.jwt.key-alias}")
    private String keyAlias;

    @Value("${app.security.jwt.private-key-passphrase}")
    private String privateKeyPassphrase;

    private RSAPrivateKey rsaPrivateKey;
    private RSAPublicKey rsaPublicKey;


    @PostConstruct
    public void initRSAKey() {
        this.rsaPrivateKey = createJWTSigningKey();
        this.rsaPublicKey = createJWTValidationKey();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        if (rsaPublicKey == null) {
            throw new IllegalArgumentException("RSA public key can't be null");
        }
        return NimbusJwtDecoder.withPublicKey(rsaPublicKey).build();
    }

    public RSAPrivateKey createJWTSigningKey() {
        try {
            Key key = createKeyStore().getKey(keyAlias, privateKeyPassphrase.toCharArray());
            if (key instanceof RSAPrivateKey) {
                return (RSAPrivateKey) key;
            }
        } catch (UnrecoverableKeyException | NoSuchAlgorithmException | KeyStoreException e) {
            log.error("Unable to load private key from keystore: {}", keyStorePath, e);
        }
        throw new IllegalArgumentException("Unable to load private key");
    }

    public RSAPublicKey createJWTValidationKey() {
        try {
            Certificate certificate = createKeyStore().getCertificate(keyAlias);
            PublicKey publicKey = certificate.getPublicKey();

            if (publicKey instanceof RSAPublicKey) {
                return (RSAPublicKey) publicKey;
            }
        } catch (KeyStoreException e) {
            log.error("Unable to load private key from keystore: {}", keyStorePath, e);
        }
        throw new IllegalArgumentException("Unable to load RSA public key");
    }

    private KeyStore createKeyStore() {
        try {
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            InputStream resourceAsStream = Thread.currentThread().getContextClassLoader()
                    .getResourceAsStream(keyStorePath);
            keyStore.load(resourceAsStream, keyStorePassword.toCharArray());
            return keyStore;
        } catch (IOException | CertificateException | NoSuchAlgorithmException | KeyStoreException e) {
            log.error("Unable to load keystore: {}", keyStorePath, e);
        }
        throw new IllegalArgumentException("Unable to load keystore");
    }
}
