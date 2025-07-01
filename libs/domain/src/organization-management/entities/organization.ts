import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from '../../common';
import { OrganizationId, OrganizationName } from '../value-objects';
import { OrgCreatedEvent } from '../events';

export class Organization extends AggregateRoot<DomainEvent> {

  private nextEventVersion = 0;

  constructor(private readonly id: OrganizationId,
              private readonly name: OrganizationName) {
    super();
    this.apply(new OrgCreatedEvent(
      id.value(),
      this.nextEventVersion++,
      { name: name.value() })
    );
  }
}
