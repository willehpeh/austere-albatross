import { AggregateRoot, EventPublisher } from '@nestjs/cqrs';
import { DomainEvent } from '@austere-albatross/austere-domain';

export class FakeEventPublisher extends EventPublisher {
  private publishedEvents: DomainEvent[] = [];
  private mergedAggregates: AggregateRoot[] = [];

  override mergeObjectContext<T extends AggregateRoot>(object: T): T {
    this.mergedAggregates.push(object);

    const originalCommit = object.commit.bind(object);
    object.commit = () => {
      const events = object.getUncommittedEvents() as DomainEvent[];
      this.publishedEvents.push(...events);
      originalCommit();
    };

    return object;
  }

  getPublishedEvents(): DomainEvent[] {
    return [...this.publishedEvents];
  }
}
