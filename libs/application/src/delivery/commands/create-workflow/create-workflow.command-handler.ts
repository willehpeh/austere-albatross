import {
  EventPublisher,
  EventStore,
  Workflow,
  WorkflowId,
  WorkflowName,
  OrganizationId
} from '@austere-albatross/austere-domain';
import { CreateWorkflowCommand } from './create-workflow.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateWorkflowCommand)
export class CreateWorkflowCommandHandler implements ICommandHandler<CreateWorkflowCommand> {
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: CreateWorkflowCommand): Promise<string> {
    const id = new WorkflowId(crypto.randomUUID());
    const name = new WorkflowName(command.name);
    const organizationId = new OrganizationId(command.organizationId);
    const workflow = new Workflow(id, name, organizationId);
    this.eventPublisher.mergeObjectContext(workflow);
    await this.eventStore.appendEvents(id.value(), workflow.getUncommittedEvents());
    workflow.commit();
    return Promise.resolve(id.value());
  }
}
