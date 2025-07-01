import { FakeEventStore } from '../../common/fixtures';
import { CreateOrgCommand, CreateOrgCommandHandler } from '@austere-albatross/austere-application';
import { OrgCreatedEvent } from '@austere-albatross/austere-domain';


describe('Create Org Command', () => {
  let command: CreateOrgCommand;
  let handler: CreateOrgCommandHandler;
  let eventStore: FakeEventStore;

  let orgName: string;
  let orgId: string;
  let orgCreatedEvent: OrgCreatedEvent;

  beforeEach(() => {
    orgName = 'Test Org';
    command = new CreateOrgCommand(orgName);
    eventStore = new FakeEventStore();
    handler = new CreateOrgCommandHandler(eventStore);
  });

  it('should return a string that is the ID of the created org', async () => {
    const id = await handler.execute(command);
    const orgEventStream = eventStore.events.get(id);
    expect(orgEventStream).toBeDefined();
  });

  it('should commit the correct OrgCreatedEvent to the Event Store', async () => {
    orgId = await handler.execute(command);
    const orgEventStream = eventStore.events.get(orgId);
    orgCreatedEvent = orgEventStream?.[0] as OrgCreatedEvent;
    expect(orgCreatedEvent).toEqual(new OrgCreatedEvent(orgId, 0, { name: orgName }));
  });


});
