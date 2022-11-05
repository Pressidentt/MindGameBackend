import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { RegistrationDto } from './dto/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginCredentialsDto: LoginCredentialsDto) {
    return this.authService.login(loginCredentialsDto);
  }
  @Post('/registration')
  async signUp(@Body() registrationDto: RegistrationDto) {
    return this.authService.registration(registrationDto)
  }
}
