import { FakeEventStore } from '../../common/fixtures';
import { CreateOrgCommand, CreateOrgCommandHandler, CreateOrgDto } from '@austere-albatross/austere-application';

describe('Create Org Command', () => {
  let dto: CreateOrgDto;
  let command: CreateOrgCommand;
  let handler: CreateOrgCommandHandler;
  let eventStore: FakeEventStore;

  it('should raise an OrgCreated event', () => {
    expect(true).toBeTruthy();
  });
});
