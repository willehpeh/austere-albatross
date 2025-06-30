import { EventStore, Organization, OrganizationId } from '@austere-albatross/austere-domain';
import { CreateOrgCommand } from './create-org.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateOrgCommand)
export class CreateOrgCommandHandler implements ICommandHandler<CreateOrgCommand> {
  constructor(private readonly eventStore: EventStore) {
  }

  async execute(command: CreateOrgCommand): Promise<string> {
    const id = new OrganizationId(crypto.randomUUID());
    const org = new Organization(id);
    await this.eventStore.appendEvents(id.value(), org.getUncommittedEvents());
    org.commit();
    return Promise.resolve(id.value());
  }
}
