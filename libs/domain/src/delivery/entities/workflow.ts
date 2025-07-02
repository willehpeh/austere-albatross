import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from '../../common';
import { OrganizationId } from '../../organization-management';
import { WorkflowId, WorkflowName } from '../value-objects';
import { WorkflowCreatedEvent } from '../events';

export class Workflow extends AggregateRoot<DomainEvent> {
  private nextEventVersion = 0;

  constructor(
    private readonly id: WorkflowId,
    private readonly name: WorkflowName,
    private readonly organizationId: OrganizationId
  ) {
    super();
    this.apply(new WorkflowCreatedEvent(
      id.value(),
      this.nextEventVersion++,
      {
        name: name.value(),
        organizationId: organizationId.value(),
      }
    ));
  }
}
