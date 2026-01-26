package com.tirth.microservices.provider_service.service;

import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;
import com.tirth.microservices.provider_service.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository repository;

    @Override
    public Provider registerProvider(String username) {

        Provider provider = new Provider();
        provider.setUsername(username);
        provider.setStatus(ProviderStatus.PENDING);
        provider.setActive(false);

        return repository.save(provider);
    }


    @Override
    public boolean isProviderActive(String username) {
        return repository.findByUsername(username)
                .map(Provider::isActive)
                .orElse(false);
    }

    @Override
    public Provider approveProvider(Long providerId) {

        Provider provider = repository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        if (provider.getStatus() != ProviderStatus.PENDING) {
            throw new RuntimeException("Provider already processed");
        }

        provider.setStatus(ProviderStatus.ACTIVE);
        provider.setActive(true);

        return repository.save(provider);
    }


    @Override
    public Provider rejectProvider(Long providerId) {

        Provider provider = repository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        if (provider.getStatus() != ProviderStatus.PENDING) {
            throw new IllegalStateException("Provider already processed");
        }

        provider.setStatus(ProviderStatus.INACTIVE);
        provider.setActive(false);

        return repository.save(provider);
    }


    @Override
    public Provider getByUsername(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }
}
