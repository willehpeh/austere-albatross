import { FakeEventPublisher, FakeEventStore } from '../../common/fixtures';
import { RenameWorkflowStepCommand, RenameWorkflowStepCommandHandler } from '@austere-albatross/austere-application';

describe('Rename Workflow Step Command', () => {
  let command: RenameWorkflowStepCommand;
  let handler: RenameWorkflowStepCommandHandler;
  let eventStore: FakeEventStore;
  let eventPublisher: FakeEventPublisher;

  beforeEach(() => {
    eventStore = new FakeEventStore();
    eventPublisher = new FakeEventPublisher();
    handler = new RenameWorkflowStepCommandHandler(eventStore, eventPublisher);
  });

  it('should PLACEHOLDER', () => {
    expect(true).toBeTruthy();
  })
});
