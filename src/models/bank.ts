import { UserId } from "@/types/Common";
import BankAccount from "@/models/bank-account";
import GlobalRegistry from "@/services/GlobalRegistry";
import { generateUUID } from "@/services/Utils";

interface BankConfig {
  isNegativeAllowed: boolean;
}

export default class Bank {
  private id: string;
  private accounts: BankAccount[] = [];
  private isNegativeAllowed: boolean;

  constructor(isNegativeAllowed: boolean = false) {
    this.id = generateUUID();
    this.isNegativeAllowed = isNegativeAllowed;

    GlobalRegistry.addBank(this);
  }

  static create(config: BankConfig): Bank;
  static create(config?: { isNegativeAllowed?: boolean }): Bank;

  static create(config?: { isNegativeAllowed?: boolean }): Bank {
    const isNegativeAllowed = config?.isNegativeAllowed ?? false;
    return new Bank(isNegativeAllowed);
  }

  getId(): string {
    return this.id;
  }

  createAccount(balance: number): BankAccount {
    const account = new BankAccount(this.id, balance);
    this.accounts.push(account);
    return account;
  }

  send(
    senderUserId: UserId,
    recipientUserId: UserId,
    amount: number,
    recipientBankId?: string
  ): void {
    const sender = GlobalRegistry.getUser(senderUserId);
    const recipient = GlobalRegistry.getUser(recipientUserId);
  
    if (!sender || !recipient) throw new Error("User not found");
  
    if(recipientBankId) {
      const senderAccounts = sender.getAccountIds()
      .map((id) => GlobalRegistry.getBankAccount(id)).
      filter((account) => account.getBankId() === this.id);
      const recipientAccounts = recipient.getAccountIds()
      .map((id) => GlobalRegistry.getBankAccount(id)).
      filter((account) => account.getBankId() === recipientBankId);
  
      if (!senderAccounts.length) throw new Error("Sender has no accounts in this bank");
      if (!recipientAccounts.length) throw new Error("Recipient has no accounts in the recipient's bank");
  
      let remainingAmount = amount;
  
      if(this.isNegativeAllowed) {
        senderAccounts[0].withdraw(amount);
        remainingAmount -= amount;
        recipientAccounts[0].deposit(amount);
        return;
      }

      else {
        const allBalance = senderAccounts.reduce((total, account) => total + account.getBalance(), 0);
        if(allBalance < amount) throw new Error("Insufficient funds");
        for (const account of senderAccounts) {
          if (account.checkValidWithdrawal(remainingAmount)) {
            account.withdraw(remainingAmount);
            recipientAccounts[0].deposit(remainingAmount);
            return;
          } else {
            remainingAmount -= account.getBalance();
          }
        }
      }
    }
  
    else {
      const senderAccounts = sender.getAccountIds()
      .map((id) => GlobalRegistry.getBankAccount(id)).
      filter((account) => account.getBankId() === this.id);
      const recipientAccounts = recipient.getAccountIds()
      .map((id) => GlobalRegistry.getBankAccount(id)).
      filter((account) => account.getBankId() === this.id);
  
      if (!senderAccounts.length) throw new Error("Sender has no accounts in this bank");
      if (!recipientAccounts.length) throw new Error("Recipient has no accounts in this bank");
  
      let remainingAmount = amount;
  
      if(this.isNegativeAllowed) {
        senderAccounts[0].withdraw(amount);
        remainingAmount -= amount;
        recipientAccounts[0].deposit(amount);
        return;
      }

      else {
        const allBalance = senderAccounts.reduce((total, account) => total + account.getBalance(), 0);
        if(allBalance < amount) throw new Error("Insufficient funds");
        for (const account of senderAccounts) {
          if (account.checkValidWithdrawal(remainingAmount)) {
            account.withdraw(remainingAmount);
            recipientAccounts[0].deposit(remainingAmount);
            return;
          } else {
            remainingAmount -= account.getBalance();
          }
        }
      }
    }
  }

  getAccount(id: string): BankAccount {
    return this.accounts.find((account) => account.getId() === id);
  }
}
