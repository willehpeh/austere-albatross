import { EventStore } from '../../common';

export class OrganizationUniquenessService {
  constructor(private readonly eventStore: EventStore) {}

  async ensureNameIsUnique(name: string): Promise<void> {
    const nameExists = await this.eventStore.organizationExistsWithName(name);
    if (nameExists) {
      throw new Error('Organization with this name already exists');
    }
  }
}
