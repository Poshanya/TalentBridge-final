package com.talentbridge.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.talentbridge.dto.LoginRequestDTO;
import com.talentbridge.dto.LoginResponseDTO;
import com.talentbridge.entity.User;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
            ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService=jwtService;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findFirstByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException("Invalid email or password");
        }

        LoginResponseDTO response = new LoginResponseDTO();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        String token = jwtService.generateToken(user);

        response.setToken(token);

        return response;


    }
    }
