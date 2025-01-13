import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, BankId } from "@/types/Common";

export default class BankAccount {
  private id: BankAccountId;
  private balance: number;
  private bankId: BankId;
  private isNegativeAllowed: boolean;

  constructor(bankId: BankId, initialBalance: number = 0, isNegativeAllowed: boolean = false) {
    this.id = crypto.randomUUID();
    this.balance = initialBalance;
    this.bankId = bankId;
    this.isNegativeAllowed = isNegativeAllowed;
    GlobalRegistry.addBankAccount(this);
  }

  getId(): BankAccountId {
    return this.id;
  }

  getBankId(): BankId {
    return this.bankId;
  }

  getBalance(): number {
    return this.balance;
  }

  canWithdraw(amount: number): boolean {
    return this.isNegativeAllowed || this.balance >= amount;
  }

  withdraw(amount: number): void {
    if (!this.canWithdraw(amount)) {
      throw new Error('Insufficient funds');
    }
    this.balance -= amount;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }
}