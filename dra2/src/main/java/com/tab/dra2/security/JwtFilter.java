package com.tab.dra2.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            @Nonnull HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nonnull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || authHeader.isBlank()) {
            log.debug("JWT filter: no Authorization header for {} {}", request.getMethod(), request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        if (!authHeader.startsWith("Bearer ")) {
            log.debug("JWT filter: Authorization header is present but not Bearer for {} {}", request.getMethod(),
                    request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        if (jwtUtil.isValid(token)) {
            String username = jwtUtil.getUsername(token);
            String role = jwtUtil.getRole(token);

            log.debug("JWT filter: authenticated user={} role={} for {} {}", username, role, request.getMethod(),
                    request.getRequestURI());

            var auth = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role)));
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);
        } else {
            log.warn("JWT filter: invalid or expired token for {} {}", request.getMethod(), request.getRequestURI());

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            // 2. Dodanie nagłówka informującego o problemie z tokenem (dobra praktyka)
            response.setHeader("WWW-Authenticate",
                    "Bearer error=\"invalid_token\", error_description=\"The access token expired or is invalid\"");

            // 3. Stworzenie ładnego body w formacie JSON
            String jsonResponse = """
                    {
                        "status": 401,
                        "error": "Unauthorized",
                        "code": "TOKEN_EXPIRED",
                        "message": "Twój token wygasł lub jest nieprawidłowy."
                    }
                    """;

            response.getWriter().write(jsonResponse);

            // 4. PRZERWANIE FILTRACJI - nie wywołujemy filterChain.doFilter
            return;

        }

        filterChain.doFilter(request, response);
    }
}