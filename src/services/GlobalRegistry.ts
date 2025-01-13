import User from "@/models/user";
import Bank from "@/models/bank";
import BankAccount from "@/models/bank-account";

export default class GlobalRegistry {
    private static users: Map<string, User> = new Map();
    private static banks: Map<string, Bank> = new Map();
    private static bankAccounts: Map<string, BankAccount> = new Map();
  
    static addUser(user: User): void {
      this.users.set(user.getId(), user);
    }
  
    static getUser(userId: string): User | undefined {
      return this.users.get(userId);
    }
  
    static addBank(bank: Bank): void {
      this.banks.set(bank.getId(), bank);
    }
  
    static getBank(bankId: string): Bank | undefined {
      return this.banks.get(bankId);
    }
  
    static addBankAccount(bankAccount: BankAccount): void {
      this.bankAccounts.set(bankAccount.getId(), bankAccount);
    }
  
    static getBankAccount(bankAccountId: string): BankAccount | undefined {
      return this.bankAccounts.get(bankAccountId);
    }

    static getUsers(): User[] {
      return Array.from(this.users.values());
    }
  
    static getBanks(): Bank[] {
      return Array.from(this.banks.values());
    }

    static getBankAccounts(): BankAccount[] {
      return Array.from(this.bankAccounts.values());
    }

    static clear() {
      this.users.clear();   
      this.banks.clear();
      this.bankAccounts.clear();   
    }
  }
  