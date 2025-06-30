import { ValueObject } from "../../common";

export class OrganizationId implements ValueObject<string> {

  constructor(private readonly id: string) {}

  value(): string {
    return this.id;
  }

  equals(vo: ValueObject<string>): boolean {
    return vo.value() === this.id;
  }

}
