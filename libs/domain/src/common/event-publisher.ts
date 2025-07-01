import { AggregateRoot } from '@nestjs/cqrs';

export abstract class EventPublisher {
  abstract mergeObjectContext<T extends AggregateRoot>(object: T): T;
}