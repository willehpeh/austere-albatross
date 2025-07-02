import { FakeEventPublisher, FakeEventStore, FakeOrganizationNameReadModel } from '../../common/fixtures';
import { RegisterOrgCommand, RegisterOrgCommandHandler } from '@austere-albatross/austere-application';
import { OrgRegisteredEvent } from '@austere-albatross/austere-domain';


describe('Create Org Command', () => {
  let handler: RegisterOrgCommandHandler;
  let eventStore: FakeEventStore;
  let eventPublisher: FakeEventPublisher;
  let organizationNameReadModel: FakeOrganizationNameReadModel;

  beforeEach(() => {
    eventStore = new FakeEventStore();
    eventPublisher = new FakeEventPublisher();
    organizationNameReadModel = new FakeOrganizationNameReadModel();
    handler = new RegisterOrgCommandHandler(eventStore, eventPublisher, organizationNameReadModel);
  });

  it('should register the Organization', async () => {
    const command = new RegisterOrgCommand('Test Org');

    const orgId = await handler.execute(command);

    const orgEventStream = eventStore.events.get(orgId);
    const orgCreatedEvent = orgEventStream?.[0] as OrgRegisteredEvent;
    expect(orgEventStream).toBeDefined();
    expect(orgCreatedEvent.eventType).toBe('OrgRegistered');
  });

  it('should register an Organization with the correct OrganizationID', async () => {
    const command = new RegisterOrgCommand('Test Org');

    const orgId = await handler.execute(command);

    const orgEventStream = eventStore.events.get(orgId);
    const orgCreatedEvent = orgEventStream?.[0] as OrgRegisteredEvent;
    expect(orgCreatedEvent.aggregateId).toBe(orgId);
  });

  it('should register an Organization with no history', async () => {
    const command = new RegisterOrgCommand('Test Org');

    const orgId = await handler.execute(command);

    const orgEventStream = eventStore.events.get(orgId);
    const orgCreatedEvent = orgEventStream?.[0] as OrgRegisteredEvent;
    expect(orgCreatedEvent.eventVersion).toBe(0);
  });

  it('should register an Organization with the correct name', async () => {
    const orgName = 'Test Org';
    const command = new RegisterOrgCommand(orgName);

    const orgId = await handler.execute(command);

    const orgEventStream = eventStore.events.get(orgId);
    const orgCreatedEvent = orgEventStream?.[0] as OrgRegisteredEvent;
    expect(orgCreatedEvent.data.name).toBe(orgName);
  });

  it('should inform others that the Organization was created', async () => {
    const command = new RegisterOrgCommand('Test Org');

    const orgId = await handler.execute(command);

    const orgEventStream = eventStore.events.get(orgId);
    const orgCreatedEvent = orgEventStream?.[0] as OrgRegisteredEvent;
    expect(eventPublisher.getPublishedEvents()).toEqual([orgCreatedEvent]);
  });

  it('should refuse to register an organization with an existing name', async () => {
    const duplicateName = 'Test Org';
    const duplicateCommand = new RegisterOrgCommand(duplicateName);
    await organizationNameReadModel.addName(duplicateName);

    await expect(handler.execute(duplicateCommand)).rejects.toThrow('Organization with this name already exists');
  });

});
