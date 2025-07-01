import {
  EventPublisher,
  EventStore,
  Organization,
  OrganizationId,
  OrganizationName
} from '@austere-albatross/austere-domain';
import { RegisterOrgCommand } from './register-org.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(RegisterOrgCommand)
export class RegisterOrgCommandHandler implements ICommandHandler<RegisterOrgCommand> {
  constructor(private readonly eventStore: EventStore,
              private readonly eventPublisher: EventPublisher) {
  }

  async execute(command: RegisterOrgCommand): Promise<string> {
    const id = new OrganizationId(crypto.randomUUID());
    const name = new OrganizationName(command.name);
    const org = new Organization(id, name);
    this.eventPublisher.mergeObjectContext(org);
    await this.eventStore.appendEvents(id.value(), org.getUncommittedEvents());
    org.commit();
    return Promise.resolve(id.value());
  }
}
