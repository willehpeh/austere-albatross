import { OrganizationNameReadModel } from '@austere-albatross/austere-domain';

export class FakeOrganizationNameReadModel implements OrganizationNameReadModel {
  private names = new Set<string>();

  async nameExists(name: string): Promise<boolean> {
    return this.names.has(name);
  }

  async addName(name: string): Promise<void> {
    this.names.add(name);
  }

  // Helper method for testing
  clear(): void {
    this.names.clear();
  }

  // Helper method for testing
  getNames(): string[] {
    return Array.from(this.names);
  }
}
