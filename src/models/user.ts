import GlobalRegistry from "@/services/GlobalRegistry";
import { generateUUID } from "@/services/Utils";

type BankAccountId = string;

export default class User {
  private id: string;
  private name: string;
  private accountIds: BankAccountId[];

  constructor(name: string, accountIds: BankAccountId[]) {
    this.id = generateUUID();
    this.name = name;
    this.accountIds = accountIds;

    GlobalRegistry.addUser(this);
  }

  static create(name: string, accountIds: BankAccountId[]): User {
    return new User(name, accountIds);
  }

  getId(): string {
    return this.id;
  }

  getAccountIds(): BankAccountId[] {
    return this.accountIds;
  }
}
