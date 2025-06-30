import { EventStore, OrganizationId } from '@austere-albatross/austere-domain';
import { CreateOrgCommand } from './create-org.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateOrgCommand)
export class CreateOrgCommandHandler implements ICommandHandler<CreateOrgCommand> {
  constructor(private readonly eventStore: EventStore) {
  }

  async execute(command: CreateOrgCommand): Promise<string> {
    const id = new OrganizationId(crypto.randomUUID());
    await this.eventStore.appendEvents(id.value(), [{
      eventType: 'OrgCreated',
      aggregateId: id.value(),
      eventVersion: 0,
      occurredOn: new Date(),
    }]);
    return Promise.resolve(id.value());
  }
}
