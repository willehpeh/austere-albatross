import { CreateOrgDto } from './create-org.dto';

export class CreateOrgCommand {
  constructor(public readonly dto: CreateOrgDto) {
  }
}
