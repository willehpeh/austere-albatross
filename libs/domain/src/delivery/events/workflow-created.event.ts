import { DomainEvent } from '../../common';

export class WorkflowCreatedEvent extends DomainEvent {
  public readonly data: WorkflowCreatedEventProps;

  constructor(aggregateId: string, eventVersion: number, data: WorkflowCreatedEventProps) {
    super(aggregateId, eventVersion, 'WorkflowCreated');
    this.data = data;
  }
}

export type WorkflowCreatedEventProps = {
  readonly name: string;
  readonly organizationId: string;
  readonly steps: readonly string[];
};
