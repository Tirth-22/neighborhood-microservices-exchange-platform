package com.tirth.microservices.provider_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tirth.microservices.provider_service.dto.ProviderRegisterRequest;
import com.tirth.microservices.provider_service.dto.ProviderRegisterResponse;
import com.tirth.microservices.provider_service.dto.ServiceOfferingRequest;
import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;
import com.tirth.microservices.provider_service.entity.ServiceOffering;
import com.tirth.microservices.provider_service.entity.ServiceType;
import com.tirth.microservices.provider_service.event.ProviderApprovedEvent;
import com.tirth.microservices.provider_service.event.ProviderRegisteredEvent;
import com.tirth.microservices.provider_service.event.ProviderRejectedEvent;
import com.tirth.microservices.provider_service.exception.DuplicateProviderException;
import com.tirth.microservices.provider_service.exception.ForbiddenException;
import com.tirth.microservices.provider_service.exception.ResourceNotFoundException;
import com.tirth.microservices.provider_service.producer.ProviderEventProducer;
import com.tirth.microservices.provider_service.repository.ProviderRepository;
import com.tirth.microservices.provider_service.repository.ServiceOfferingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository repository;
    private final ServiceOfferingRepository serviceOfferingRepository;
    private final ProviderEventProducer eventProducer;

    @Override
    public ProviderRegisterResponse registerProvider(String username, ProviderRegisterRequest request) {

        ServiceType serviceType = ServiceType.valueOf(request.getServiceType());

        try {
            if (repository.existsByUsername(username)) {
                throw new DuplicateProviderException(
                        "Provider with username '" + username + "' already exists"
                );
            }

            Provider provider = Provider.builder()
                    .username(username)
                    .serviceType(serviceType)
                    .status(ProviderStatus.PENDING)
                    .active(false)
                    .build();

            Provider saved = repository.save(provider);

            // Send notification to admins
            eventProducer.publishProviderRegisteredEvent(
                    ProviderRegisteredEvent.builder()
                            .providerId(saved.getId())
                            .providerUsername(username)
                            .serviceType(serviceType.name())
                            .build()
            );

            return new ProviderRegisterResponse("Pending Approval");

        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateProviderException(
                    "Provider with username '" + username + "' already exists"
            );
        }
    }

    @Override
    public Provider getByUsername(String username) {
        return repository.findByUsername(username)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Provider not found"));
    }

    @Override
    public Provider approveProvider(Long providerId, String adminUsername) {

        Provider provider = repository.findById(providerId)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Provider not found"));

        if (provider.getStatus() != ProviderStatus.PENDING) {
            throw new IllegalStateException("Only PENDING providers can be approved");
        }

        provider.setStatus(ProviderStatus.ACTIVE);
        provider.setActive(true);
        provider.setApprovedBy(adminUsername);
        provider.setApprovedAt(LocalDateTime.now());

        Provider saved = repository.save(provider);

        // Send notification to provider
        eventProducer.publishProviderApprovedEvent(
                ProviderApprovedEvent.builder()
                        .providerId(saved.getId())
                        .providerUsername(saved.getUsername())
                        .serviceType(saved.getServiceType().name())
                        .approvedBy(adminUsername)
                        .build()
        );

        return saved;
    }

    @Override
    public Provider rejectProvider(Long providerId) {

        Provider provider = repository.findById(providerId)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Provider not found"));

        if (provider.getStatus() != ProviderStatus.PENDING) {
            throw new IllegalStateException("Only PENDING providers can be rejected");
        }

        provider.setStatus(ProviderStatus.INACTIVE);
        provider.setActive(false);

        Provider saved = repository.save(provider);

        // Send notification to provider
        eventProducer.publishProviderRejectedEvent(
                ProviderRejectedEvent.builder()
                        .providerId(saved.getId())
                        .providerUsername(saved.getUsername())
                        .serviceType(saved.getServiceType().name())
                        .build()
        );

        return saved;
    }

    @Override
    public boolean isProviderActive(String username) {
        return repository.findByUsername(username)
                .map(Provider::isActive)
                .orElse(false);
    }

    @Override
    public List<Provider> getAllProviders() {
        return repository.findAll();
    }

    @Override
    public List<Provider> getProvidersByStatus(ProviderStatus status) {
        return repository.findByStatus(status);
    }

    @Override
    public ServiceOffering createService(String username, ServiceOfferingRequest request) {
        // Provider must exist and be ACTIVE to create services
        Provider provider = repository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                "Provider profile not found. Please register as a provider first."));

        // Security check: Only ACTIVE providers can create services
        if (provider.getStatus() != ProviderStatus.ACTIVE) {
            throw new ForbiddenException(
                    "Cannot create services. Your provider status is: " + provider.getStatus()
                    + ". Please wait for admin approval.");
        }

        ServiceOffering service = ServiceOffering.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .provider(provider)
                .providerUsername(provider.getUsername())
                .providerName(provider.getUsername()) // or display name
                .active(true)
                .build();

        return serviceOfferingRepository.save(service);
    }

    @Override
    public List<ServiceOffering> getAllActiveServices() {
        return serviceOfferingRepository.findByActiveTrue();
    }

    @Override
    public List<ServiceOffering> getMyServices(String username) {
        return serviceOfferingRepository.findByProviderUsername(username);
    }

    @Override
    public void deleteService(Long id, String username, String role) {

        ServiceOffering service = serviceOfferingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        if (!"ADMIN".equals(role) && !service.getProviderUsername().equals(username)) {
            throw new RuntimeException("Unauthorized to delete this service");
        }

        serviceOfferingRepository.delete(service);
    }
}
