import { FakeEventPublisher, FakeEventStore } from '../../common/fixtures';
import { CreateWorkflowCommand, CreateWorkflowCommandHandler } from '@austere-albatross/austere-application';
import { DomainEvent, WorkflowCreatedEvent } from '@austere-albatross/austere-domain';

describe('Create Workflow Command', () => {
  let command: CreateWorkflowCommand;
  let handler: CreateWorkflowCommandHandler;
  let eventStore: FakeEventStore;
  let eventPublisher: FakeEventPublisher;

  let workflowName: string;
  let organizationId: string;
  let workflowId: string;
  let workflowEventStream: DomainEvent[] | undefined;
  let workflowCreatedEvent: WorkflowCreatedEvent;

  beforeEach(async () => {
    workflowName = 'Product Release Workflow';
    organizationId = 'org-123';
    command = new CreateWorkflowCommand(workflowName, organizationId);
    eventStore = new FakeEventStore();
    eventPublisher = new FakeEventPublisher();
    handler = new CreateWorkflowCommandHandler(eventStore, eventPublisher);
    workflowId = await handler.execute(command);
    workflowEventStream = eventStore.events.get(workflowId);
    workflowCreatedEvent = workflowEventStream?.[0] as WorkflowCreatedEvent;
  });

  it('should create the Workflow', () => {
    expect(workflowEventStream).toBeDefined();
    expect(workflowCreatedEvent.eventType).toBe('WorkflowCreated');
  });

  it('should create a Workflow with the correct WorkflowID', () => {
    expect(workflowCreatedEvent.aggregateId).toBe(workflowId);
  });

  it('should create a Workflow with no history', () => {
    expect(workflowCreatedEvent.eventVersion).toBe(0);
  });

  it('should create a Workflow with the correct name', () => {
    expect(workflowCreatedEvent.data.name).toBe(workflowName);
  });

  it('should create a Workflow belonging to the correct Organization', () => {
    expect(workflowCreatedEvent.data.organizationId).toBe(organizationId);
  });

  it('should inform others that the Workflow was created', () => {
    expect(eventPublisher.getPublishedEvents()).toEqual([workflowCreatedEvent]);
  });
});
