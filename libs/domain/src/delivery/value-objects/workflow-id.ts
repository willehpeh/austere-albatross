import { ValueObject } from '../../common';

export class WorkflowId implements ValueObject<string> {
  constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('Workflow ID cannot be empty');
    }
  }

  value(): string {
    return this._value;
  }

  equals(other: WorkflowId): boolean {
    return this._value === other._value;
  }
}
