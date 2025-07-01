import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent, EventPublisher } from '@austere-albatross/austere-domain';

export class FakeEventPublisher extends EventPublisher {
  private publishedEvents: DomainEvent[] = [];

  override mergeObjectContext<T extends AggregateRoot>(object: T): T {

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
