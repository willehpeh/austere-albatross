import { FakeEventPublisher, FakeEventStore } from '../../common/fixtures';
import { CreateWorkflowCommand, CreateWorkflowCommandHandler } from '@austere-albatross/austere-application';
import { WorkflowCreatedEvent } from '@austere-albatross/austere-domain';

describe('Create Workflow Command', () => {
  let handler: CreateWorkflowCommandHandler;
  let eventStore: FakeEventStore;
  let eventPublisher: FakeEventPublisher;

  beforeEach(() => {
    eventStore = new FakeEventStore();
    eventPublisher = new FakeEventPublisher();
    handler = new CreateWorkflowCommandHandler(eventStore, eventPublisher);
  });

  it('should create the Workflow', async () => {
    const command = new CreateWorkflowCommand('Product Release Workflow', 'org-123');

    const workflowId = await handler.execute(command);

    const workflowEventStream = eventStore.events.get(workflowId);
    const workflowCreatedEvent = workflowEventStream?.[0] as WorkflowCreatedEvent;
    expect(workflowEventStream).toBeDefined();
    expect(workflowCreatedEvent.eventType).toBe('WorkflowCreated');
  });

  it('should create a Workflow with the correct WorkflowID', async () => {
    const command = new CreateWorkflowCommand('Product Release Workflow', 'org-123');

    const workflowId = await handler.execute(command);

    const workflowEventStream = eventStore.events.get(workflowId);
    const workflowCreatedEvent = workflowEventStream?.[0] as WorkflowCreatedEvent;
    expect(workflowCreatedEvent.aggregateId).toBe(workflowId);
  });

  it('should create a Workflow with no history', async () => {
    const command = new CreateWorkflowCommand('Product Release Workflow', 'org-123');

    const workflowId = await handler.execute(command);

    const workflowEventStream = eventStore.events.get(workflowId);
    const workflowCreatedEvent = workflowEventStream?.[0] as WorkflowCreatedEvent;
    expect(workflowCreatedEvent.eventVersion).toBe(0);
  });

  it('should create a Workflow with the correct name', async () => {
    const workflowName = 'Product Release Workflow';
    const command = new CreateWorkflowCommand(workflowName, 'org-123');

    const workflowId = await handler.execute(command);

    const workflowEventStream = eventStore.events.get(workflowId);
    const workflowCreatedEvent = workflowEventStream?.[0] as WorkflowCreatedEvent;
    expect(workflowCreatedEvent.data.name).toBe(workflowName);
  });

  it('should create a Workflow belonging to the correct Organization', async () => {
    const organizationId = 'org-123';
    const command = new CreateWorkflowCommand('Product Release Workflow', organizationId);

    const workflowId = await handler.execute(command);

    const workflowEventStream = eventStore.events.get(workflowId);
    const workflowCreatedEvent = workflowEventStream?.[0] as WorkflowCreatedEvent;
    expect(workflowCreatedEvent.data.organizationId).toBe(organizationId);
  });

  it('should create a Workflow with steps: committed, in-process, and completed', async () => {
    const command = new CreateWorkflowCommand('Product Release Workflow', 'org-123');

    const workflowId = await handler.execute(command);

    const workflowEventStream = eventStore.events.get(workflowId);
    const workflowCreatedEvent = workflowEventStream?.[0] as WorkflowCreatedEvent;
    expect(workflowCreatedEvent.data.steps).toEqual([{ label: 'committed' }, { label: 'in-process' }, { label: 'completed' }]);
  });

  it('should inform others that the Workflow was created', async () => {
    const command = new CreateWorkflowCommand('Product Release Workflow', 'org-123');

    const workflowId = await handler.execute(command);

    const workflowEventStream = eventStore.events.get(workflowId);
    const workflowCreatedEvent = workflowEventStream?.[0] as WorkflowCreatedEvent;
    expect(eventPublisher.getPublishedEvents()).toEqual([workflowCreatedEvent]);
  });
});
