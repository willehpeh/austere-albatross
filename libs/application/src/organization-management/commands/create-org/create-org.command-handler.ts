import { EventStore } from '@austere-albatross/austere-domain';
import { CreateOrgCommand } from './create-org.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateOrgCommand)
export class CreateOrgCommandHandler implements ICommandHandler<CreateOrgCommand> {
  constructor(private readonly eventStore: EventStore) {
  }

  async execute(command: CreateOrgCommand): Promise<string> {
    const id = '123';
    await this.eventStore.appendEvents(id, []);
    return Promise.resolve(id);
  }
}
