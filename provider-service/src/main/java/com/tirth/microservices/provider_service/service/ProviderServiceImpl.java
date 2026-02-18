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
import com.tirth.microservices.provider_service.exception.DuplicateProviderException;
import com.tirth.microservices.provider_service.exception.ResourceNotFoundException;
import com.tirth.microservices.provider_service.repository.ProviderRepository;
import com.tirth.microservices.provider_service.repository.ServiceOfferingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository repository;
    private final ServiceOfferingRepository serviceOfferingRepository;


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

            repository.save(provider);
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
        // Check if provider exists, otherwise create one
        Provider provider = repository.findByUsername(username).orElse(null);

        if (provider == null) {
            // Auto-create provider profile
            ServiceType sType = ServiceType.OTHER;
            try {
                if (request.getCategory() != null) {
                    sType = ServiceType.valueOf(request.getCategory().toUpperCase());
                }
            } catch (IllegalArgumentException e) {
                sType = ServiceType.OTHER;
            }

            provider = Provider.builder()
                    .username(username)
                    .serviceType(sType)
                    .status(ProviderStatus.ACTIVE) // Auto-approve for seamless flow
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            provider = repository.save(provider);
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
