import { ValueObject } from "../../common";

export class OrganizationName implements ValueObject<string> {
  constructor(private readonly name: string) {
  }
  value(): string {
    return this.name;
  }
  equals(other: OrganizationName): boolean {
    return other.value() === this.name;
  }
}
