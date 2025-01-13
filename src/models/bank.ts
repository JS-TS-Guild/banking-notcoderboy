import GlobalRegistry from "../services/GlobalRegistry";
import User from "./user";
import BankAccount from "./bank-account";
import { BankAccountId, UserId, BankId } from "@/types/Common";

export default class Bank {
  private id: BankId;
  private isNegativeAllowed: boolean;

  private constructor(options?: { isNegativeAllowed?: boolean }) {
    this.id = crypto.randomUUID();
    this.isNegativeAllowed = options?.isNegativeAllowed ?? false;
    GlobalRegistry.addBank(this);
  }

  static create(options?: { isNegativeAllowed?: boolean }): Bank {
    return new Bank(options);
  }

  getId(): BankId {
    return this.id;
  }

  createAccount(initialBalance: number = 0): BankAccount {
    const account = new BankAccount(this.id, initialBalance, this.isNegativeAllowed);
    GlobalRegistry.addBankAccount(account);
    return account;
  }

  getAccount(accountId: BankAccountId): BankAccount {
    const account = GlobalRegistry.getBankAccount(accountId);
    if (!account || account.getBankId() !== this.id) {
      throw new Error('Account not found');
    }
    return account;
  }

  private findSuitableAccount(user: User, amount: number): BankAccount | null {
    // Get all accounts for this bank in priority order
    const accountIds = user.getAccountIdsForBank(this.id);
    
    // Try each account in priority order until we find one with sufficient funds
    for (const accountId of accountIds) {
      const account = this.getAccount(accountId);
      if (account.canWithdraw(amount)) {
        return account;
      }
    }
    
    return null;
  }

  send(fromUserId: UserId, toUserId: UserId, amount: number, toBankId?: BankId): void {
    const fromUser = GlobalRegistry.getUser(fromUserId);
    const toUser = GlobalRegistry.getUser(toUserId);
    
    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    // If toBankId is not specified, assume it's an internal transfer
    const targetBankId = toBankId || this.id;

    // Find suitable source account based on priority
    const fromAccount = this.findSuitableAccount(fromUser, amount);
    if (!fromAccount) {
      throw new Error('Insufficient funds in all accounts');
    }

    // Find first available account in target bank
    const toAccountId = toUser.getAccountIdsForBank(targetBankId)[0];
    const toAccount = toAccountId ? GlobalRegistry.getBankAccount(toAccountId) : null;

    if (!toAccount) {
      throw new Error('Recipient has no account in target bank');
    }

    fromAccount.withdraw(amount);
    toAccount.deposit(amount);
  }
}