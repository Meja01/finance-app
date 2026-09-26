package org.example.finance.transactions.infrastructure;

import org.example.finance.accounts.application.GetAccountService;
import org.example.finance.transactions.application.GetAccountBalanceService;
import org.example.finance.transactions.application.MonthlyStatsService;
import org.example.finance.transactions.domain.TransactionType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/stats")
public class StatsController {
    private final MonthlyStatsService monthlyStatsService;
    private final GetAccountBalanceService getAccountBalanceService;

    public StatsController(MonthlyStatsService monthlyStatsService, GetAccountBalanceService getAccountBalanceService) {
        this.monthlyStatsService = monthlyStatsService;
        this.getAccountBalanceService = getAccountBalanceService;
    }

    @GetMapping("/monthly")
    public MonthlyStatsResponse getMonthlyStats(@RequestParam int year, @RequestParam int month, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return monthlyStatsService.getMonthlyStats(userId, year, month);
    }

    @GetMapping("/categories")
    public List<CategoryStatsResponse> getCategoryStats(@RequestParam int year,
                                                        @RequestParam int month,
                                                        @RequestParam TransactionType type,
                                                        Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return  monthlyStatsService.getCategoryStats(userId, year, month, type);
    }

    @GetMapping("/accounts/{accountId}/balance")
    public AccountBalanceResponse getAccountBalance(@PathVariable UUID accountId, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return getAccountBalanceService.getAccountBalance(userId, accountId);
    }

    @GetMapping("/accounts/balances")
    public List<AccountBalanceResponse> getAccountsBalance(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return getAccountBalanceService.getAccountsBalance(userId);
    }
}
