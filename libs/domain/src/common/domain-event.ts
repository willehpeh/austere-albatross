export type DomainEvent<T = null> = {
  readonly aggregateId: string;
  readonly eventType: string;
  readonly eventVersion: number;
  readonly occurredOn: Date;
  readonly data?: T;
}
