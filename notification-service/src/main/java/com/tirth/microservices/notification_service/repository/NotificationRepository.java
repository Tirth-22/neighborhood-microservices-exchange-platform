package com.tirth.microservices.notification_service.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tirth.microservices.notification_service.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    long countByUserIdAndReadFalse(String userId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.userId = :userId AND n.read = false")
    int markAllAsRead(@Param("userId") String userId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.requestId = :requestId AND n.type = 'REQUEST_CREATED'")
    int markRequestCreatedAsRead(@Param("requestId") Long requestId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Notification n SET n.read = true, n.requestStatus = 'CANCELLED' WHERE n.requestId = :requestId AND n.type = 'REQUEST_CREATED' AND n.userId = :userId")
    int markRequestCreatedAsCancelled(@Param("requestId") Long requestId, @Param("userId") String userId);

    Page<Notification> findByUserIdOrderByCreatedAtDesc(
            String userId,
            Pageable pageable
    );
}
