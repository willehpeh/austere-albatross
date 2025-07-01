import { DomainEvent } from '../../common';

export class OrgCreatedEvent extends DomainEvent {

  public readonly data: OrgCreatedEventProps;

  constructor(aggregateId: string, eventVersion: number, data: OrgCreatedEventProps) {
    super(aggregateId, eventVersion, 'OrgCreated');
    this.data = data;
  }
}

export type OrgCreatedEventProps = { name: string };
