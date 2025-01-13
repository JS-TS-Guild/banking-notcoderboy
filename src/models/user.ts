
import GlobalRegistry from '@/services/GlobalRegistry';
import { UserId, BankAccountId } from '@/types/Common';

export default class User {
  private id: UserId;
  private name: string;
  private accountIds: BankAccountId[];

  private constructor(name: string, accountIds: BankAccountId[]) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.accountIds = accountIds;
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

  getAccountIds(): BankAccountId[] {
    return [...this.accountIds];
  }
}