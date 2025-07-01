export class DomainEvent {
  readonly occurredOn: Date;

  constructor(public readonly aggregateId: string,
              public readonly eventVersion: number,
              public readonly eventType: string) {
    this.occurredOn = new Date();
  }
}
