import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({
    description: 'The text of the incident report to be analyzed',
    example:
      'Machine A-12 overheated in Sector 7. Operator John Doe was present.',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}
