import { FakeEventStore } from '../../common/fixtures';
import { CreateOrgCommand, CreateOrgCommandHandler } from '@austere-albatross/austere-application';

describe('Create Org Command', () => {
  let command: CreateOrgCommand;
  let handler: CreateOrgCommandHandler;
  let eventStore: FakeEventStore;

  beforeEach(() => {
    command = new CreateOrgCommand();
    eventStore = new FakeEventStore();
    handler = new CreateOrgCommandHandler(eventStore);
  })

  it('should return a string that is the ID of the created org', async () => {
    const id = await handler.execute(command);
    const orgEventStream = eventStore.events.get(id);
    expect(orgEventStream).toBeDefined();
  });

  it('should append an OrgCreated event to the event store', async () => {
    const id = await handler.execute(command);
    const orgEventStream = eventStore.events.get(id);
    const orgCreatedEvent = orgEventStream?.[0];
    expect(orgCreatedEvent?.eventType).toBe('OrgCreated');
  });
});
