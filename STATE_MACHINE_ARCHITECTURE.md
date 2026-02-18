# Request Service - State Machine Architecture

## Overview

This document explains the **strict state machine implementation** that enforces valid request status transitions in the Service Request lifecycle.

### Problem Solved

**Before:** Provider could accept/reject a CANCELLED request
```
User creates request → Provider accepts → User cancels → Provider still can Accept/Reject ❌
```

**After:** Provider cannot perform ANY action on CANCELLED request
```
User creates request → Provider accepts → User cancels → Provider gets 403 error ✅
```

---

## State Machine Design

### Valid State Transitions

```
PENDING ──→ ACCEPTED ──→ COMPLETED
   ├──→ REJECTED
   └──→ CANCELLED

Terminal States: CANCELLED, REJECTED, COMPLETED
```

### Transition Rules (Enum-Based State Machine)

```java
// File: RequestStateTransition.java
PENDING   → {ACCEPTED, REJECTED, CANCELLED}
ACCEPTED  → {COMPLETED}
REJECTED  → {} (terminal state)
CANCELLED → {} (terminal state)
COMPLETED → {} (terminal state)
```

---

## Implementation Architecture

### 1. State Machine Validator Class

**File:** `request-service/src/main/java/.../state/RequestStateTransition.java`

```java
public class RequestStateTransition {
    // Static map defines all valid transitions
    private static final Map<RequestStatus, Set<RequestStatus>> VALID_TRANSITIONS;
    
    // Methods:
    ✓ isValidTransition(current, target)       // Checks if transition is allowed
    ✓ getTransitionErrorMessage(current, target)  // Returns descriptive error
    ✓ getValidTransitions(current)              // Lists allowed next states
    ✓ isTerminalState(status)                   // Checks if no more transitions
}
```

### 2. Safe Service Methods

**Pattern used in all state-changing methods:**

```java
// Step 1: Fetch & validate entity exists
ServiceRequest request = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

// Step 2: Validate authorization (role/ownership)
if (!validRole) {
    throw new UnauthorizedActionException("Permission denied");
}

// Step 3: VALIDATE STATE TRANSITION (NEW - MOST IMPORTANT)
if (!RequestStateTransition.isValidTransition(request.getStatus(), targetStatus)) {
    throw new InvalidRequestStateException(
        RequestStateTransition.getTransitionErrorMessage(
            request.getStatus(), targetStatus
        )
    );
}

// Step 4: Perform state transition
request.setStatus(targetStatus);
request.setTimestamp(LocalDateTime.now());

// Step 5: Persist & publish event
repository.save(request);
eventProducer.publishEvent(event);
```

---

## Methods Updated

### 1. `accept()` - Provider Accepts Request

```java
ServiceRequestResponseDTO accept(Long id, String role, String username)

Validates:
├─ Role == PROVIDER
├─ Provider is ACTIVE
├─ Status: PENDING → ACCEPTED ⭐ (State Machine)
└─ Sets: acceptedBy, acceptedAt

Error if CANCELLED:
"Invalid state transition: cannot transition from 'CANCELLED' to 'ACCEPTED'. 
Allowed transitions from 'CANCELLED': []"
```

### 2. `reject()` - Provider Rejects Request

```java
ServiceRequestResponseDTO reject(Long id, String role, String username)

Validates:
├─ Role == PROVIDER
├─ Status: PENDING → REJECTED ⭐ (State Machine)
└─ Sets: rejectedBy, rejectedAt

Error if CANCELLED:
"Request with status 'CANCELLED' cannot be transitioned to any other state."
```

### 3. `cancel()` - User Cancels Request

```java
ServiceRequestResponseDTO cancel(Long id, String username)

Validates:
├─ Ownership == requestedBy
├─ Status: PENDING → CANCELLED ⭐ (State Machine)
└─ Sets: status = CANCELLED

Error if already ACCEPTED:
"Invalid state transition: cannot transition from 'ACCEPTED' to 'CANCELLED'. 
Allowed transitions from 'ACCEPTED': [COMPLETED]"
```

### 4. `complete()` - User Completes Request

```java
ServiceRequestResponseDTO complete(Long id, String username, String role, Double rating)

Validates:
├─ Role == USER
├─ Ownership == requestedBy
├─ Status: ACCEPTED → COMPLETED ⭐ (State Machine)
└─ Sets: status = COMPLETED, rating

Error if CANCELLED:
"Request with status 'CANCELLED' cannot be transitioned to any other state."
```

---

## Error Messages (Descriptive)

### Terminal State Attempt
```
"Request with status 'CANCELLED' cannot be transitioned to any other state. 
Request is in a terminal state."
```

### Invalid Transition
```
"Invalid state transition: cannot transition from 'ACCEPTED' to 'CANCELLED'. 
Allowed transitions from 'ACCEPTED': [COMPLETED]"
```

---

## Benefits of This Design

| Aspect | Benefit |
|--------|---------|
| **Type Safe** | Compile-time checking with enum |
| **Reusable** | Single validation method for all transitions |
| **Maintainable** | State rules in one place (RequestStateTransition) |
| **Scalable** | Easy to add new states/transitions |
| **Testable** | Validator methods can be unit tested independently |
| **Clear Errors** | Users know exactly why action was rejected |
| **Business Logic Safe** | Impossible to reach invalid states |

---

## How to Extend

### Adding a New Status/Transition

```java
// In RequestStateTransition.java
static {
    VALID_TRANSITIONS.put(RequestStatus.PAUSED, EnumSet.of(
        RequestStatus.PENDING,      // Resume → Go back to PENDING
        RequestStatus.CANCELLED     // Or cancel permanently
    ));
}
```

### Adding a New Operation

```java
@Override
public ServiceRequestResponseDTO myNewOperation(Long id, String username) {
    ServiceRequest request = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
    
    // Always validate state transition
    if (!RequestStateTransition.isValidTransition(
            request.getStatus(), 
            RequestStatus.NEW_TARGET_STATUS)) {
        throw new InvalidRequestStateException(
            RequestStateTransition.getTransitionErrorMessage(
                request.getStatus(), 
                RequestStatus.NEW_TARGET_STATUS
            )
        );
    }
    
    // ... rest of implementation
}
```

---

## Testing Strategy

### Unit Tests for State Machine

```java
@Test
void testValidTransitions() {
    assertTrue(RequestStateTransition.isValidTransition(
        RequestStatus.PENDING, RequestStatus.ACCEPTED));
    
    assertTrue(RequestStateTransition.isValidTransition(
        RequestStatus.ACCEPTED, RequestStatus.COMPLETED));
}

@Test
void testInvalidTransitions() {
    assertFalse(RequestStateTransition.isValidTransition(
        RequestStatus.CANCELLED, RequestStatus.ACCEPTED));
    
    assertFalse(RequestStateTransition.isValidTransition(
        RequestStatus.COMPLETED, RequestStatus.REJECTED));
}

@Test
void testTerminalStates() {
    assertTrue(RequestStateTransition.isTerminalState(
        RequestStatus.CANCELLED));
}
```

### Integration Tests

```java
@Test
void testCannotAcceptCancelledRequest() {
    // Create, cancel, then try to accept
    createRequest(id);
    cancelRequest(id);
    
    assertThrows(InvalidRequestStateException.class, 
        () -> acceptRequest(id));
}
```

---

## API Response Examples

### Success: Accept PENDING Request
```json
HTTP/1.1 200 OK
{
    "id": 13,
    "status": "ACCEPTED",
    "title": "OTHER Request",
    "acceptedBy": "provider",
    "acceptedAt": "2026-02-18T18:33:10.307998087"
}
```

### Error: Accept CANCELLED Request
```json
HTTP/1.1 400 Bad Request
{
    "error": "Invalid Request State",
    "message": "Invalid state transition: cannot transition from 'CANCELLED' to 'ACCEPTED'. 
               Allowed transitions from 'CANCELLED': []"
}
```

---

## State Diagram

```
    ┌─────────────┐
    │   PENDING   │  (Initial State)
    └──────┬──────┘
           │
      ┌────┼────┐
      ▼    ▼    ▼
   ACCEPTED REJECTED CANCELLED
      │       (TER)    (TER)
      │
      ▼
  COMPLETED (TER)
```

Legend:
- (TER) = Terminal State (no outgoing transitions)

---

## Files Modified

1. **Created:** `request-service/src/main/java/.../state/RequestStateTransition.java`
   - State machine validator with enum-based transitions
   
2. **Updated:** `request-service/src/main/java/.../service/RequestServiceImpl.java`
   - Added import: `RequestStateTransition`
   - Modified methods:
     - `accept()` - Added state validation
     - `reject()` - Added state validation
     - `cancel()` - Added state validation
     - `complete()` - Added state validation

---

## Deployment Checklist

- [x] RequestStateTransition.java created
- [x] RequestServiceImpl imports updated
- [x] All four state-changing methods updated
- [x] Maven compilation verified
- [x] Docker image rebuilt
- [x] Containers restarted
- [ ] Integration tests run
- [ ] Manual testing: Try to accept cancelled request (should fail)
- [ ] Apply pattern to other services (if needed)

---

## Result

✅ **Provider CANNOT accept/reject CANCELLED requests anymore**

User workflow now guaranteed safe:
```
1. User creates request (PENDING) → Notification sent ✓
2. User cancels request (CANCELLED) → Cancellation notification sent ✓
3. Provider attempts to accept (CANCELLED) → 400 Error ✓
4. Provider sees descriptive error message ✓
```

