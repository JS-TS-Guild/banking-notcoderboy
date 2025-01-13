import BankAccount from './bank-account';
import GlobalRegistry from '@/services/GlobalRegistry';
import { BankId, UserId, BankAccountId } from '@/types/Common';

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

  send(fromUserId: UserId, toUserId: UserId, amount: number, toBankId?: BankId): void {
    const fromUser = GlobalRegistry.getUser(fromUserId);
    const toUser = GlobalRegistry.getUser(toUserId);
    
    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    // If toBankId is not provided, assume it's an internal transfer
    const targetBankId = toBankId || this.id;
    
    // Get all accounts for the sender in this bank
    const fromAccounts = fromUser.getAccountIds()
      .map(id => GlobalRegistry.getBankAccount(id))
      .filter(account => account && account.getBankId() === this.id);

    // Find the first account that can cover the transfer
    const fromAccount = fromAccounts.find(account => account.canWithdraw(amount));
    if (!fromAccount) {
      throw new Error('Insufficient funds');
    }

    // Get recipient's account in the target bank
    const toAccount = toUser.getAccountIds()
      .map(id => GlobalRegistry.getBankAccount(id))
      .find(account => account && account.getBankId() === targetBankId);

    if (!toAccount) {
      throw new Error('Recipient account not found in target bank');
    }

    fromAccount.withdraw(amount);
    toAccount.deposit(amount);
  }}