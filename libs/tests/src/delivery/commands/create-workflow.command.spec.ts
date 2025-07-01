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

  it('should create an event stream for the Workflow', () => {
    expect(workflowEventStream).toBeDefined();
  });

  it('should commit a WorkflowCreatedEvent with the correct aggregate ID', () => {
    expect(workflowCreatedEvent.aggregateId).toBe(workflowId);
  });

  it('should commit a WorkflowCreatedEvent with event version 0', () => {
    expect(workflowCreatedEvent.eventVersion).toBe(0);
  });

  it('should commit a WorkflowCreatedEvent with the correct event type', () => {
    expect(workflowCreatedEvent.eventType).toBe('WorkflowCreated');
  });

  it('should commit a WorkflowCreatedEvent with the correct workflow name', () => {
    expect(workflowCreatedEvent.data.name).toBe(workflowName);
  });

  it('should commit a WorkflowCreatedEvent with the correct organization ID', () => {
    expect(workflowCreatedEvent.data.organizationId).toBe(organizationId);
  });

  it('should commit a WorkflowCreatedEvent with no steps', () => {
    expect(workflowCreatedEvent.data.steps).toEqual([]);
  });

  it('should publish the correct WorkflowCreatedEvent to the Event Publisher', () => {
    expect(eventPublisher.getPublishedEvents()).toEqual([workflowCreatedEvent]);
  });
});
