export class CreateWorkflowCommand {
  constructor(
    public readonly name: string,
    public readonly organizationId: string
  ) {}
}
