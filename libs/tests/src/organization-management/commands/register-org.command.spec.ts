import { FakeEventPublisher, FakeEventStore, FakeOrganizationNameReadModel } from '../../common/fixtures';
import { RegisterOrgCommand, RegisterOrgCommandHandler } from '@austere-albatross/austere-application';
import { DomainEvent, OrgRegisteredEvent } from '@austere-albatross/austere-domain';


describe('Create Org Command', () => {
  let command: RegisterOrgCommand;
  let handler: RegisterOrgCommandHandler;
  let eventStore: FakeEventStore;
  let eventPublisher: FakeEventPublisher;
  let organizationNameReadModel: FakeOrganizationNameReadModel;

  let orgName: string;
  let orgId: string;
  let orgEventStream: DomainEvent[] | undefined;
  let orgCreatedEvent: OrgRegisteredEvent;

  beforeEach(async () => {
    orgName = 'Test Org';
    command = new RegisterOrgCommand(orgName);
    eventStore = new FakeEventStore();
    eventPublisher = new FakeEventPublisher();
    organizationNameReadModel = new FakeOrganizationNameReadModel();
    handler = new RegisterOrgCommandHandler(eventStore, eventPublisher, organizationNameReadModel);
    orgId = await handler.execute(command);
    orgEventStream = eventStore.events.get(orgId);
    orgCreatedEvent = orgEventStream?.[0] as OrgRegisteredEvent;
  });

  it('should register the Organization', () => {
    expect(orgEventStream).toBeDefined();
    expect(orgCreatedEvent.eventType).toBe('OrgRegistered');
  });

  it('should register an Organization with the correct OrganizationID', () => {
    expect(orgCreatedEvent.aggregateId).toBe(orgId);
  });

  it('should register an Organization with no history', () => {
    expect(orgCreatedEvent.eventVersion).toBe(0);
  });

  it('should register an Organization with the correct name', () => {
    expect(orgCreatedEvent.data.name).toBe(orgName);
  });

  it('should inform others that the Organization was created', () => {
    expect(eventPublisher.getPublishedEvents()).toEqual([orgCreatedEvent]);
  });

  it('should refuse to register an organization with an existing name', async () => {
    const duplicateName = 'Test Org';
    const duplicateCommand = new RegisterOrgCommand(duplicateName);
    await organizationNameReadModel.addName(duplicateName);

    await expect(handler.execute(duplicateCommand)).rejects.toThrow('Organization with this name already exists');
  });

});
