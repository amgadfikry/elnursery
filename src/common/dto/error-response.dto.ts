import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP status code of the error' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'Detailed explanation of the error' })
  error: string;

  @ApiProperty({
    example: '2023-07-26T12:23:34.123Z',
    description: 'Timestamp of when the error occurred',
  })
  timestamp: string;

  @ApiProperty({ example: '/task', description: 'Path where the error occurred' })
  path: string;

  @ApiProperty({ example: 'POST', description: 'Method erroe occue when apply to path'})
  method: string;

  @ApiProperty({
    example: 'Password contain 1 special case at least',
    description: 'Messgaes that descripe error, if multiple separated by comma'
  })
  message: string;
}
