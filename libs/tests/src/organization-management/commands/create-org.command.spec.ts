import { FakeEventStore } from '../../common/fixtures';
import { CreateOrgCommand, CreateOrgCommandHandler } from '@austere-albatross/austere-application';
import { DomainEvent } from '@austere-albatross/austere-domain';

type OrgCreatedEvent = DomainEvent & {
  eventType: 'OrgCreated',
  data: { name: string; }
};

describe('Create Org Command', () => {
  let command: CreateOrgCommand;
  let handler: CreateOrgCommandHandler;
  let eventStore: FakeEventStore;
  let orgName: string;

  beforeEach(() => {
    orgName = 'Test Org';
    command = new CreateOrgCommand(orgName);
    eventStore = new FakeEventStore();
    handler = new CreateOrgCommandHandler(eventStore);
  })

  it('should return a string that is the ID of the created org', async () => {
    const id = await handler.execute(command);
    const orgEventStream = eventStore.events.get(id);
    expect(orgEventStream).toBeDefined();
  });

  describe('OrgCreatedEvent on EventStore', () => {

    let orgId: string;
    let orgCreatedEvent: OrgCreatedEvent;

    beforeEach(async () => {
      eventStore.events.clear();
      orgId = await handler.execute(command);
      const orgEventStream = eventStore.events.get(orgId);
      orgCreatedEvent = orgEventStream?.[0] as OrgCreatedEvent;
    });

    it('should be of the correct type', async () => {
      expect(orgCreatedEvent.eventType).toBe('OrgCreated');
    });

    it('should have the correct org name', async () => {
      expect(orgCreatedEvent.data.name).toBe(orgName);
    });

  });
});
