import { OrganizationNameReadModel } from '../read-models';

export class OrganizationUniquenessService {
  constructor(private readonly organizationNameReadModel: OrganizationNameReadModel) {}

  async ensureNameIsUnique(name: string): Promise<void> {
    const nameExists = await this.organizationNameReadModel.nameExists(name);
    if (nameExists) {
      throw new Error('Organization with this name already exists');
    }
  }
}
