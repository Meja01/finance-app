package org.example.finance.users.infrastructure;

import org.example.finance.security.JwtService;
import org.example.finance.users.application.LoginUserService;
import org.example.finance.users.application.RegisterUserService;
import org.example.finance.users.domain.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    private final RegisterUserService registerUserService;
    private final LoginUserService loginUserService;
    private final JwtService jwtService;
    public UserController(RegisterUserService registerUserService, LoginUserService loginUserService, JwtService jwtService) {
        this.registerUserService = registerUserService;
        this.loginUserService = loginUserService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public RegisterUserResponse register(@RequestBody RegisterUserRequest request) {
        User user = registerUserService.register(
                request.name(),
                request.email(),
                request.password());

        return new RegisterUserResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());
    }

    @PostMapping("/login")
    public LoginUserResponse register(@RequestBody LoginUserRequest request) {
        User user = loginUserService.login(
                request.email(),
                request.password());

        String token = jwtService.generateToken(user);

        return new LoginUserResponse(user.getId(), user.getName(), user.getEmail(), token);
    }
}
