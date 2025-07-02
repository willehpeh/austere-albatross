import { DomainEvent, EventStore } from '@austere-albatross/austere-domain';

export class FakeEventStore implements EventStore {
  events: Map<string, DomainEvent[]> = new Map();
  eventCounts: Map<string, number> = new Map();

  async appendEvents(streamId: string, events: DomainEvent[], expectedVersion?: number): Promise<void> {
    const currentVersion = this.eventCounts.get(streamId) || 0;

    if (this.expectedVersionIsProvidedAndWrong(expectedVersion, currentVersion)) {
      throw new Error(`Expected version ${ expectedVersion } but current version is ${ currentVersion }`);
    }

    this.appendEventsToStream(streamId, events);
    this.updateCounts(streamId, currentVersion, events);
  }

  async getEvents(streamId: string, fromVersion?: number): Promise<DomainEvent[]> {
    const events = this.events.get(streamId) || [];

    if (fromVersion === undefined) {
      return [...events];
    }

    return events.slice(fromVersion);
  }

  private updateCounts(streamId: string, currentVersion: number, events: DomainEvent[]) {
    this.eventCounts.set(streamId, currentVersion + events.length);
  }

  private appendEventsToStream(streamId: string, events: DomainEvent[]) {
    const streamEvents = this.events.get(streamId) || [];
    streamEvents.push(...events);
    this.events.set(streamId, streamEvents);
  }

  private expectedVersionIsProvidedAndWrong(expectedVersion: number | undefined, currentVersion: number) {
    return expectedVersion !== undefined && expectedVersion !== currentVersion;
  }


}
