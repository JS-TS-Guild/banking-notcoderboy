import GlobalRegistry from "../services/GlobalRegistry";
import { BankId, BankAccountId, UserId } from "../types/Common";

export default class User {
  private id: UserId;
  private name: string;
  // Accounts are stored in priority order
  private accountIds: BankAccountId[];

  private constructor(name: string, accountIds: BankAccountId[]) {
    this.id = crypto.randomUUID();
    this.name = name;
    // Store accounts in the order they are provided (priority order)
    this.accountIds = [...accountIds];
    GlobalRegistry.addUser(this);
  }

  static create(name: string, accountIds: BankAccountId[]): User {
    return new User(name, accountIds);
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  // Returns accounts in their priority order
  getAccountIds(): BankAccountId[] {
    return [...this.accountIds];
  }

  // Get accounts for a specific bank in priority order
  getAccountIdsForBank(bankId: BankId): BankAccountId[] {
    return this.accountIds.filter(accountId => {
      const account = GlobalRegistry.getBankAccount(accountId);
      return account?.getBankId() === bankId;
    });
  }
}