import { FakeEventStore } from '../../common/fixtures';
import { CreateOrgCommand, CreateOrgCommandHandler, CreateOrgDto } from '@austere-albatross/austere-application';

describe('Create Org Command', () => {
  let dto: CreateOrgDto;
  let command: CreateOrgCommand;
  let handler: CreateOrgCommandHandler;
  let eventStore: FakeEventStore;

  beforeEach(() => {
    dto = {};
    command = new CreateOrgCommand(dto);
    eventStore = new FakeEventStore();
    handler = new CreateOrgCommandHandler(eventStore);
  })

  it('should return a string that is the ID of the created org', async () => {
    const id = await handler.execute(command);
    expect(eventStore.events.get(id)).toBeDefined();
  });
});
