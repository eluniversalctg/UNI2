import { ApiProperty } from '@nestjs/swagger';

export class CreateDomainDto {
  readonly _id: string;

  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly domain: string;
  @ApiProperty()
  readonly idSite: string;
}
