export interface OrganizationNameReadModel {
  nameExists(name: string): Promise<boolean>;
  addName(name: string): Promise<void>;
}
