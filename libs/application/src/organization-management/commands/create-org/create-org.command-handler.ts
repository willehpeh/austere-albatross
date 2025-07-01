import {
  EventPublisher,
  EventStore,
  Organization,
  OrganizationId,
  OrganizationName
} from '@austere-albatross/austere-domain';
import { CreateOrgCommand } from './create-org.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateOrgCommand)
export class CreateOrgCommandHandler implements ICommandHandler<CreateOrgCommand> {
  constructor(private readonly eventStore: EventStore,
              private readonly eventPublisher: EventPublisher) {
  }

  async execute(command: CreateOrgCommand): Promise<string> {
    const id = new OrganizationId(crypto.randomUUID());
    const name = new OrganizationName(command.name);
    const org = new Organization(id, name);
    this.eventPublisher.mergeObjectContext(org);
    await this.eventStore.appendEvents(id.value(), org.getUncommittedEvents());
    org.commit();
    return Promise.resolve(id.value());
  }
}
