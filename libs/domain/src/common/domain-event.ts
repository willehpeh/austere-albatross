export type DomainEvent = {
  readonly aggregateId: string;
  readonly eventType: string;
  readonly eventVersion: number;
  readonly occurredOn: Date;
  readonly data: unknown;
}
