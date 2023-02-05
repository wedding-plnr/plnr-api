import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, Max, MinLength } from 'class-validator';

export class SignUpDto {
  @MinLength(5)
  @ApiProperty()
  username: string;

  @Length(2, 2)
  @ApiProperty()
  state: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @MinLength(10)
  @ApiProperty()
  password: string;
}
