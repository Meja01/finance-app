package org.example.finance.users.infrastructure;

import org.example.finance.security.JwtService;
import org.example.finance.security.RefreshToken;
import org.example.finance.security.RefreshTokenService;
import org.example.finance.users.application.LoginUserService;
import org.example.finance.users.application.LogoutUserService;
import org.example.finance.users.application.RefreshAccessTokenService;
import org.example.finance.users.application.RegisterUserService;
import org.example.finance.users.domain.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final RegisterUserService registerUserService;
    private final RefreshTokenService refreshTokenService;
    private final RefreshAccessTokenService refreshAccessTokenService;
    private final LogoutUserService logoutUserService;
    private final LoginUserService loginUserService;
    private final JwtService jwtService;
    public UserController(RegisterUserService registerUserService, RefreshTokenService refreshTokenService, RefreshAccessTokenService refreshAccessTokenService, LogoutUserService logoutUserService, LoginUserService loginUserService, JwtService jwtService) {
        this.registerUserService = registerUserService;
        this.refreshTokenService = refreshTokenService;
        this.refreshAccessTokenService = refreshAccessTokenService;
        this.logoutUserService = logoutUserService;
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
    public LoginUserResponse login(@RequestBody LoginUserRequest request) {
        User user = loginUserService.login(
                request.email(),
                request.password());

        String token = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new LoginUserResponse(user.getId(), user.getName(), user.getEmail(), token, refreshToken.getToken());
    }

    @PostMapping("/refresh")
    public RefreshTokenResponse refreshAccessToken(@RequestBody RefreshTokenRequest request) {
        String accessToken = refreshAccessTokenService.refreshAccessToken(request.refreshToken());
        return new RefreshTokenResponse(accessToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody RefreshTokenRequest request) {
        logoutUserService.logout(request.refreshToken());
        return ResponseEntity.noContent().build();
    }
}
