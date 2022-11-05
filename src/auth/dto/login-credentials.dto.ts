import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginCredentialsDto {

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
