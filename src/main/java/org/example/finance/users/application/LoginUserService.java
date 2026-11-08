package org.example.finance.users.application;

import org.example.finance.common.exception.InvalidCredentialsException;
import org.example.finance.users.domain.User;
import org.example.finance.users.domain.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginUserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Credentials!"));

        if(!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid Credentials!");
        }

        return user;
    }
}
