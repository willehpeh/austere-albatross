import { EventPublisher as NestEventPublisher } from '@nestjs/cqrs';
import { EventPublisher } from '@austere-albatross/austere-domain';
import { AggregateRoot } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NestJsEventPublisherAdapter extends EventPublisher {
  constructor(private readonly nestEventPublisher: NestEventPublisher) {
    super();
  }

  mergeObjectContext<T extends AggregateRoot>(object: T): T {
    return this.nestEventPublisher.mergeObjectContext(object);
  }
}