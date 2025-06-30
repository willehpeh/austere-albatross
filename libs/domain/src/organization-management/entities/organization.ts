import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from '../../common';
import { OrganizationId, OrganizationName } from '../value-objects';

export class Organization extends AggregateRoot<DomainEvent> {
  constructor(private readonly id: OrganizationId,
              private readonly name: OrganizationName) {
    super();
    this.apply({
      eventType: 'OrgCreated',
      aggregateId: id.value(),
      eventVersion: 0,
      occurredOn: new Date(),
      data: {
        name: name.value(),
      }
    });
  }
}
