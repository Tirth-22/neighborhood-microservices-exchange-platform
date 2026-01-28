package com.tirth.microservices.provider_service.exception;

public class DuplicateProviderException extends RuntimeException {

    public DuplicateProviderException(String message) {
        super(message);
    }
}
