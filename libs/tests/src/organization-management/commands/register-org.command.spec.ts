import { FakeEventPublisher, FakeEventStore } from '../../common/fixtures';
import { RegisterOrgCommand, RegisterOrgCommandHandler } from '@austere-albatross/austere-application';
import { DomainEvent, OrgRegisteredEvent } from '@austere-albatross/austere-domain';


describe('Create Org Command', () => {
  let command: RegisterOrgCommand;
  let handler: RegisterOrgCommandHandler;
  let eventStore: FakeEventStore;
  let eventPublisher: FakeEventPublisher;

  let orgName: string;
  let orgId: string;
  let orgEventStream: DomainEvent[] | undefined;
  let orgCreatedEvent: OrgRegisteredEvent;

  beforeEach(async () => {
    orgName = 'Test Org';
    command = new RegisterOrgCommand(orgName);
    eventStore = new FakeEventStore();
    eventPublisher = new FakeEventPublisher();
    handler = new RegisterOrgCommandHandler(eventStore, eventPublisher);
    orgId = await handler.execute(command);
    orgEventStream = eventStore.events.get(orgId);
    orgCreatedEvent = orgEventStream?.[0] as OrgRegisteredEvent;
  });

  it('should create an event stream for the Organization', () => {
    expect(orgEventStream).toBeDefined();
  });

  it('should commit an OrgCreatedEvent with the correct OrganizationID', () => {
    expect(orgCreatedEvent.aggregateId).toBe(orgId);
  });

  it('should commit an OrgCreatedEvent that is the first event for this Organization', () => {
    expect(orgCreatedEvent.eventVersion).toBe(0);
  });

  it('should commit an OrgCreatedEvent with the correct event type', () => {
    expect(orgCreatedEvent.eventType).toBe('OrgRegistered');
  });

  it('should commit an OrgCreatedEvent with the correct organization name', () => {
    expect(orgCreatedEvent.data.name).toBe(orgName);
  });

  it('should publish the correct OrgCreatedEvent to the Event Publisher', () => {
    expect(eventPublisher.getPublishedEvents()).toEqual([orgCreatedEvent]);
  });

  it('should throw an error when trying to create an organization with an existing name', async () => {
    // Arrange
    const duplicateName = 'Test Org';
    const duplicateCommand = new RegisterOrgCommand(duplicateName);
    
    // Act & Assert
    await expect(handler.execute(duplicateCommand)).rejects.toThrow('Organization with this name already exists');
  });

});
