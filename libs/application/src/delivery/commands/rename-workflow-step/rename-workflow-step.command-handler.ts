import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RenameWorkflowStepCommand } from './rename-workflow-step.command';
import { EventPublisher, EventStore } from '@austere-albatross/austere-domain';

@CommandHandler(RenameWorkflowStepCommand)
export class RenameWorkflowStepCommandHandler implements ICommandHandler<RenameWorkflowStepCommand> {
  constructor(private readonly eventStore: EventStore, private readonly eventPublisher: EventPublisher) {

  }

  async execute(command: RenameWorkflowStepCommand): Promise<void> {
    // TODO: Implement the command handler logic here
  }
}
