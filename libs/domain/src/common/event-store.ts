import { DomainEvent } from './domain-event';

export interface EventStore {
  appendEvents(streamId: string, events: DomainEvent[], expectedVersion?: number): Promise<void>;
  getEvents(streamId: string, fromVersion?: number): Promise<DomainEvent[]>;
  organizationExistsWithName(name: string): Promise<boolean>;
}
