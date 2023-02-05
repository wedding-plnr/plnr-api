import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @MinLength(10)
  @ApiProperty()
  password: string;
}
