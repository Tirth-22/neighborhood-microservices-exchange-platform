package com.tirth.microservices.request_service.state;

import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import com.tirth.microservices.request_service.entity.RequestStatus;

public class RequestStateTransition {

    private static final Map<RequestStatus, Set<RequestStatus>> VALID_TRANSITIONS = new HashMap<>();

    static {
        // From PENDING state
        VALID_TRANSITIONS.put(RequestStatus.PENDING, EnumSet.of(
                RequestStatus.ACCEPTED,
                RequestStatus.REJECTED,
                RequestStatus.CANCELLED
        ));

        // From ACCEPTED state
        VALID_TRANSITIONS.put(RequestStatus.ACCEPTED, EnumSet.of(
                RequestStatus.COMPLETED
        ));

        // From REJECTED state - no further transitions allowed
        VALID_TRANSITIONS.put(RequestStatus.REJECTED, Collections.emptySet());

        // From CANCELLED state - no further transitions allowed
        VALID_TRANSITIONS.put(RequestStatus.CANCELLED, Collections.emptySet());

        // From COMPLETED state - no further transitions allowed
        VALID_TRANSITIONS.put(RequestStatus.COMPLETED, Collections.emptySet());
    }

    /**
     * Validate if transition from current status to target status is allowed
     *
     * @param currentStatus The current request status
     * @param targetStatus The desired target status
     * @return true if transition is valid, false otherwise
     */
    public static boolean isValidTransition(RequestStatus currentStatus, RequestStatus targetStatus) {
        if (currentStatus == null || targetStatus == null) {
            return false;
        }

        Set<RequestStatus> allowedTransitions = VALID_TRANSITIONS.getOrDefault(currentStatus, Collections.emptySet());
        return allowedTransitions.contains(targetStatus);
    }

    /**
     * Get descriptive error message for invalid transition
     *
     * @param currentStatus The current request status
     * @param targetStatus The desired target status
     * @return Descriptive error message
     */
    public static String getTransitionErrorMessage(RequestStatus currentStatus, RequestStatus targetStatus) {
        Set<RequestStatus> allowedTransitions = VALID_TRANSITIONS.get(currentStatus);

        if (allowedTransitions == null || allowedTransitions.isEmpty()) {
            return String.format(
                    "Request with status '%s' cannot be transitioned to any other state. "
                    + "Request is in a terminal state.",
                    currentStatus
            );
        }

        return String.format(
                "Invalid state transition: cannot transition from '%s' to '%s'. "
                + "Allowed transitions from '%s': %s",
                currentStatus, targetStatus, currentStatus, allowedTransitions
        );
    }

    /**
     * Get all valid target states for a given current state
     *
     * @param currentStatus The current request status
     * @return Set of valid target statuses
     */
    public static Set<RequestStatus> getValidTransitions(RequestStatus currentStatus) {
        return VALID_TRANSITIONS.getOrDefault(currentStatus, Collections.emptySet());
    }

    /**
     * Check if current status is a terminal state (no further transitions)
     *
     * @param status The request status to check
     * @return true if status is terminal
     */
    public static boolean isTerminalState(RequestStatus status) {
        Set<RequestStatus> transitions = VALID_TRANSITIONS.get(status);
        return transitions != null && transitions.isEmpty();
    }
}
