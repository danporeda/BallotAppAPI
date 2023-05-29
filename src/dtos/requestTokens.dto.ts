import { ApiProperty } from '@nestjs/swagger';

export class RequestTokensDTO {
  @ApiProperty()
  readonly address: string;
  @ApiProperty()
  readonly amount: string;
}
