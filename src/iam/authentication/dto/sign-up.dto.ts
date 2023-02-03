import { IsEmail, Length, Max, MinLength } from 'class-validator';

export class SignUpDto {
  @MinLength(5)
  username: string;

  @Length(2, 2)
  state: string;

  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;
}
