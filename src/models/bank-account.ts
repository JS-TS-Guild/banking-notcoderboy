import GlobalRegistry from "@/services/GlobalRegistry";
import { generateUUID } from "@/services/Utils";

export default class BankAccount {
  id: string;
  balance: number;
  bankId: string;

  constructor(bankId: string, balance: number = 0) {
    this.id = generateUUID();
    this.balance = balance;
    this.bankId = bankId;

    GlobalRegistry.addBankAccount(this);
  }

  getId(): string {
    return this.id;
  }

  getBalance(): number {
    return this.balance;
  }

  getBankId(): string {
    return this.bankId;
  }
  
  withdraw(amount: number): void {
    this.balance -= amount;
  }

  checkValidWithdrawal(amount: number): boolean {
    return this.balance >= amount;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }
}
