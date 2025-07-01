import {
  EventPublisher,
  EventStore,
  Organization,
  OrganizationId,
  OrganizationName,
  OrganizationUniquenessService
} from '@austere-albatross/austere-domain';
import { RegisterOrgCommand } from './register-org.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(RegisterOrgCommand)
export class RegisterOrgCommandHandler implements ICommandHandler<RegisterOrgCommand> {
  private readonly uniquenessService: OrganizationUniquenessService;

  constructor(private readonly eventStore: EventStore,
              private readonly eventPublisher: EventPublisher) {
    this.uniquenessService = new OrganizationUniquenessService(eventStore);
  }

  async execute(command: RegisterOrgCommand): Promise<string> {
    await this.uniquenessService.ensureNameIsUnique(command.name);

    const id = new OrganizationId(crypto.randomUUID());
    const name = new OrganizationName(command.name);
    const org = new Organization(id, name);
    this.eventPublisher.mergeObjectContext(org);
    await this.eventStore.appendEvents(id.value(), org.getUncommittedEvents());
    org.commit();
    return Promise.resolve(id.value());
  }
}
