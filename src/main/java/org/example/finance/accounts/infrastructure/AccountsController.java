package org.example.finance.accounts.infrastructure;
import org.example.finance.accounts.application.CreateAccountService;
import org.example.finance.accounts.application.DeleteAccountService;
import org.example.finance.accounts.application.GetAccountService;
import org.example.finance.accounts.application.UpdateAccountService;
import org.example.finance.accounts.domain.Account;
import org.example.finance.users.domain.User;
import org.example.finance.users.infrastructure.RegisterUserRequest;
import org.example.finance.users.infrastructure.RegisterUserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/accounts")
public class AccountsController {
    private final CreateAccountService createAccountService;
    private final GetAccountService getAccountService;
    private final UpdateAccountService updateAccountService;
    private final DeleteAccountService deleteAccountService;

    public AccountsController(CreateAccountService createAccountService, GetAccountService getAccountService, UpdateAccountService updateAccountService, DeleteAccountService deleteAccountService) {
        this.createAccountService = createAccountService;
        this.getAccountService = getAccountService;
        this.updateAccountService = updateAccountService;
        this.deleteAccountService = deleteAccountService;
    }

    @GetMapping
    public List<AccountResponse> getAccounts(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();

        return getAccountService.getAccounts(userId)
                .stream()
                .map(account -> new AccountResponse(
                        account.getId(),
                        account.getName(),
                        account.getType(),
                        account.getInitialBalance(),
                        account.getCreatedAt()
                )).toList();
    }

    @PostMapping
    public AccountResponse createAccount(@RequestBody CreateAccountRequest request, Authentication authentication) {
        Account account = createAccountService.createAccount(
                (UUID) authentication.getPrincipal(),
                request.name(),
                request.type(),
                request.initialBalance());

        return new AccountResponse(account.getId(), account.getName(), account.getType(), account.getInitialBalance(), account.getCreatedAt());
    }

    @PutMapping("/{accountId}")
    public AccountResponse updateAccount(@PathVariable UUID accountId, @RequestBody UpdateAccountRequest request, Authentication authentication) {
        Account account = updateAccountService.updateAccount(
                (UUID)authentication.getPrincipal(),
                accountId,
                request.name(),
                request.type(),
                request.initialBalance()
                );

        return new AccountResponse(account.getId(), account.getName(), account.getType(), account.getInitialBalance(), account.getCreatedAt());
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<Void> deleteAccount(@PathVariable UUID accountId, Authentication authentication) {
        deleteAccountService.deleteAccount((UUID) authentication.getPrincipal(), accountId);

        return ResponseEntity.noContent().build();
    }
}
