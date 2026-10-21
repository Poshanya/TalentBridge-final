package com.talentbridge.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.talentbridge.dto.UserResponseDTO;
import com.talentbridge.entity.User;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder=passwordEncoder;
    }

    public List<UserResponseDTO> getAllUsers() {

        List<User> users = userRepository.findAll();

        return users.stream().map(user -> {

            UserResponseDTO dto = new UserResponseDTO();

            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());
            dto.setCreated_at(user.getCreated_at());
            dto.setUpdated_at(user.getUpdated_at());

            return dto;

        }).toList();
    }

    public User addUser(User user) {
        if (user.getEmail() != null && userRepository.findFirstByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email " + user.getEmail() + " already exists");
        }
    	user.setPassword(
    			passwordEncoder.encode(user.getPassword()));
    	
        return userRepository.save(user);
    }

    public void deleteUser(long id) {
        userRepository.deleteById(id);
    }

    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
	            	new ResourceNotFoundException("User not found with id: "+ id)
	            		);

        UserResponseDTO dto = new UserResponseDTO();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreated_at(user.getCreated_at());
        dto.setUpdated_at(user.getUpdated_at());

        return dto;
    }
   
}