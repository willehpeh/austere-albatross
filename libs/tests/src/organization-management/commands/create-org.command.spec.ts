import { FakeEventPublisher, FakeEventStore } from '../../common/fixtures';
import { CreateOrgCommand, CreateOrgCommandHandler } from '@austere-albatross/austere-application';
import { DomainEvent, OrgCreatedEvent } from '@austere-albatross/austere-domain';


describe('Create Org Command', () => {
  let command: CreateOrgCommand;
  let handler: CreateOrgCommandHandler;
  let eventStore: FakeEventStore;
  let eventPublisher: FakeEventPublisher;

  let orgName: string;
  let orgId: string;
  let orgEventStream: DomainEvent[] | undefined;
  let orgCreatedEvent: OrgCreatedEvent;

  beforeEach(async () => {
    orgName = 'Test Org';
    command = new CreateOrgCommand(orgName);
    eventStore = new FakeEventStore();
    eventPublisher = new FakeEventPublisher();
    handler = new CreateOrgCommandHandler(eventStore, eventPublisher);
    orgId = await handler.execute(command);
    orgEventStream = eventStore.events.get(orgId);
    orgCreatedEvent = orgEventStream?.[0] as OrgCreatedEvent;
  });

  it('should return a string that is the ID of the created org', () => {
    expect(orgEventStream).toBeDefined();
  });

  it('should commit an OrgCreatedEvent with the correct aggregate ID', () => {
    expect(orgCreatedEvent.aggregateId).toBe(orgId);
  });

  it('should commit an OrgCreatedEvent with event version 0', () => {
    expect(orgCreatedEvent.eventVersion).toBe(0);
  });

  it('should commit an OrgCreatedEvent with the correct event type', () => {
    expect(orgCreatedEvent.eventType).toBe('OrgCreated');
  });

  it('should commit an OrgCreatedEvent with the correct organization name', () => {
    expect(orgCreatedEvent.data.name).toBe(orgName);
  });

  it('should commit an OrgCreatedEvent with occurredOn timestamp not in the future', () => {
    expect(orgCreatedEvent.occurredOn.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('should publish the correct OrgCreatedEvent to the Event Publisher', () => {
    expect(eventPublisher.getPublishedEvents()).toEqual([orgCreatedEvent]);
  });

});
