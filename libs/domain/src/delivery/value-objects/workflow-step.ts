import { ValueObject } from '../../common';

export type WorkflowStepProps = { label: string };

export class WorkflowStep implements ValueObject<WorkflowStepProps> {

  private readonly _value: WorkflowStepProps;

  constructor(label: string) {
    this._value = { label };
  }

  equals(step: WorkflowStep): boolean {
    return this._value.label === step._value.label;
  }

  value(): { label: string } {
    return this._value;
  }
}
