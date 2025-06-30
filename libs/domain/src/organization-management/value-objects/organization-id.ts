import { ValueObject } from "../../common";

export class OrganizationId implements ValueObject<string> {

  constructor(private readonly id: string) {}

  value(): string {
    return this.id;
  }

  equals(other: OrganizationId): boolean {
    return other.value() === this.id;
  }

}
