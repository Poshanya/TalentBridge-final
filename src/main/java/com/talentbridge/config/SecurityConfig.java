package com.talentbridge.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.talentbridge.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
                .map(String::trim).filter(origin -> !origin.isEmpty()).toList());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        // JWT is sent in the Authorization header; cookie credentials are not required.
        configuration.setAllowCredentials(false);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/candidates", "/recruiters").permitAll()

                // Recruiter-only private listing must be matched before public job routes.
                .requestMatchers(HttpMethod.GET, "/jobs/my-jobs").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.GET, "/jobs", "/jobs/{id}").permitAll()
                .requestMatchers(HttpMethod.POST, "/jobs", "/jobs/recruiter/**").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.PUT, "/jobs/**").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.DELETE, "/jobs/**").hasRole("RECRUITER")

                .requestMatchers(HttpMethod.POST, "/applications/job/**", "/applications/candidate/**").hasRole("CANDIDATE")
                .requestMatchers(HttpMethod.GET, "/applications/my-applications").hasRole("CANDIDATE")
                .requestMatchers(HttpMethod.DELETE, "/applications/**").hasRole("CANDIDATE")
                .requestMatchers(HttpMethod.GET, "/applications/recruiter-jobs", "/applications/job/**").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.PUT, "/applications/**").hasRole("RECRUITER")

                // These broad listing/admin-style endpoints have no admin role in this project.
                // Keep them closed until a proper admin authorization model is implemented.
                .requestMatchers("/users/**").denyAll()
                .requestMatchers(HttpMethod.GET, "/applications").denyAll()
                .requestMatchers(HttpMethod.GET, "/candidates").denyAll()
                .requestMatchers(HttpMethod.GET, "/recruiters").denyAll()

                .requestMatchers("/candidates/**").hasRole("CANDIDATE")
                .requestMatchers("/recruiters/**").hasRole("RECRUITER")
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
