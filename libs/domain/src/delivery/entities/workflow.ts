import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from '../../common';
import { OrganizationId } from '../../organization-management';
import { WorkflowId, WorkflowName } from '../value-objects';
import { WorkflowCreatedEvent } from '../events';
import { WorkflowStep } from '../value-objects/workflow-step';

export class Workflow extends AggregateRoot<DomainEvent> {
  private nextEventVersion = 0;
  private steps: WorkflowStep[] = [];

  constructor(
    private readonly id: WorkflowId,
    private readonly name: WorkflowName,
    private readonly organizationId: OrganizationId
  ) {
    super();
    this.addDefaultSteps();
    this.applyWorkflowCreatedEvent();
  }

  private addDefaultSteps() {
    this.steps.push(new WorkflowStep('committed'));
    this.steps.push(new WorkflowStep('in-process'));
    this.steps.push(new WorkflowStep('completed'));
  }

  private applyWorkflowCreatedEvent() {
    this.apply(new WorkflowCreatedEvent(
      this.id.value(),
      this.nextEventVersion++,
      {
        name: this.name.value(),
        organizationId: this.organizationId.value(),
        steps: this.steps.map(step => step.value())
      }
    ));
  }
}
