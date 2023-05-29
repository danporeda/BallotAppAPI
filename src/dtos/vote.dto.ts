import { ApiProperty } from '@nestjs/swagger';

export class VoteDTO {
  @ApiProperty()
  readonly proposal: number;
  @ApiProperty()
  readonly amount: number;
}
