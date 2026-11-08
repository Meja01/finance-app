package org.example.finance.users.application;

import org.example.finance.common.exception.EmailAlreadyInUseException;
import org.example.finance.users.domain.User;
import org.example.finance.users.domain.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class RegisterUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterUserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String name, String email, String rawPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyInUseException(email);
        }
        String passwordHash = passwordEncoder.encode(rawPassword);

        User user = new User(name, email, passwordHash);
        return userRepository.save(user);
    }
}
