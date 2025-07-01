import { DomainEvent } from '../../common';

export class OrgRegisteredEvent extends DomainEvent {

  public readonly data: OrgRegisteredEventProps;

  constructor(aggregateId: string, eventVersion: number, data: OrgRegisteredEventProps) {
    super(aggregateId, eventVersion, 'OrgRegistered');
    this.data = data;
  }
}

export type OrgRegisteredEventProps = { name: string };
