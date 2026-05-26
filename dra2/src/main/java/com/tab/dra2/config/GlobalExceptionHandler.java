package com.tab.dra2.config;

import com.tab.dra2.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.HttpRequestMethodNotSupportedException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentials(BadCredentialsException e) {
    ApiResponse<Object> response = ApiResponse.<Object>builder()
        .success(false)
        .message("User name or password is incorrect")
        .errors(Map.of("error", "User name or password is incorrect"))
        .timestamp(LocalDateTime.now())
        .build();
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiResponse<Object>> handleDisabled(DisabledException e) {
    ApiResponse<Object> response = ApiResponse.<Object>builder()
        .success(false)
        .message("Account is disabled")
        .errors(Map.of("error", "Account is disabled"))
        .timestamp(LocalDateTime.now())
        .build();
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(AccessDeniedException e) {
    ApiResponse<Object> response = ApiResponse.<Object>builder()
        .success(false)
        .message(e.getMessage() != null ? e.getMessage() : "Forbidden")
        .errors(Map.of("error", e.getMessage() != null ? e.getMessage() : "Forbidden"))
        .timestamp(LocalDateTime.now())
        .build();
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException e) {
    Map<String, String> errors = e.getBindingResult().getFieldErrors().stream()
        .collect(Collectors.toMap(
            FieldError::getField,
            fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "Invalid value",
            (a, b) -> a
        ));

    ApiResponse<Object> response = ApiResponse.builder()
        .success(false)
        .message("Validation failed")
        .errors(errors)
        .timestamp(LocalDateTime.now())
        .build();

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException e) {
    ApiResponse<Object> response = ApiResponse.<Object>builder()
        .success(false)
        .message(e.getMessage())
        .errors(Map.of("error", e.getMessage() != null ? e.getMessage() : "Invalid argument"))
        .timestamp(LocalDateTime.now())
        .build();
    return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalState(IllegalStateException e) {
    ApiResponse<Object> response = ApiResponse.<Object>builder()
        .success(false)
        .message(e.getMessage())
        .errors(Map.of("error", e.getMessage() != null ? e.getMessage() : "Business rule violated"))
        .timestamp(LocalDateTime.now())
        .build();
    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(response);
    }

    @ExceptionHandler(java.util.NoSuchElementException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(java.util.NoSuchElementException e) {
        ApiResponse<Object> response = ApiResponse.<Object>builder()
                .success(false)
                .message(e.getMessage() != null ? e.getMessage() : "Not found")
                .errors(Map.of("error", e.getMessage() != null ? e.getMessage() : "Not found"))
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

        @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<ApiResponse<Object>> handleMethodNotAllowed(HttpRequestMethodNotSupportedException e) {
        String method = e.getMethod();
        String message = method == null
            ? "Method not allowed"
            : "Method " + method + " not allowed";

        ApiResponse<Object> response = ApiResponse.<Object>builder()
            .success(false)
            .message(message)
            .errors(Map.of("error", message))
            .timestamp(LocalDateTime.now())
            .build();

        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(response);
        }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneric(Exception e) {
    ApiResponse<Object> response = ApiResponse.<Object>builder()
        .success(false)
        .message("Internal server error")
        .errors(Map.of("error", "An unexpected error occurred"))
        .timestamp(LocalDateTime.now())
        .build();
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}