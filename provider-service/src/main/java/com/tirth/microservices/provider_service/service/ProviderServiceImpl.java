package com.tirth.microservices.provider_service.service;

import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;
import com.tirth.microservices.provider_service.exception.DuplicateProviderException;
import com.tirth.microservices.provider_service.exception.ResourceNotFoundException;
import com.tirth.microservices.provider_service.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository repository;

    @Override
    public Provider registerProvider(String username) {
        try {
            if (repository.existsByUsername(username)) {
                throw new DuplicateProviderException(
                        "Provider with username '" + username + "' already exists"
                );
            }

            Provider provider = new Provider();
            provider.setUsername(username);
            provider.setStatus(ProviderStatus.PENDING);
            provider.setActive(false);

            return repository.save(provider);

        } catch (DataIntegrityViolationException ex) {
            // DB-level safety net (race condition)
            throw new DuplicateProviderException(
                    "Provider with username '" + username + "' already exists"
            );
        }
    }

    @Override
    public Provider getByUsername(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Provider not found"));
    }

    @Override
    public Provider approveProvider(Long providerId, String adminUsername) {
        Provider provider = repository.findById(providerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Provider not found"));

        if (provider.getStatus() != ProviderStatus.PENDING) {
            throw new IllegalStateException("Only PENDING providers can be approved");
        }

        provider.setStatus(ProviderStatus.ACTIVE);
        provider.setActive(true);
        provider.setApprovedBy(adminUsername);
        provider.setApprovedAt(LocalDateTime.now());

        return repository.save(provider);
    }

    @Override
    public Provider rejectProvider(Long providerId) {
        Provider provider = repository.findById(providerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Provider not found"));

        if (provider.getStatus() != ProviderStatus.PENDING) {
            throw new IllegalStateException("Only PENDING providers can be rejected");
        }

        provider.setStatus(ProviderStatus.INACTIVE);
        provider.setActive(false);

        return repository.save(provider);
    }

    @Override
    public boolean isProviderActive(String username) {
        return repository.findByUsername(username)
                .map(Provider::isActive)
                .orElse(false);
    }
}
