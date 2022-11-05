import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import * as bcrypt from 'bcrypt';
import { hashSync, genSaltSync } from 'bcrypt';
import { RegistrationDto } from './dto/registration.dto';


@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>,
  private readonly jwtService: JwtService,

) {}

private jwtSignTokens(jwtPayload: JwtPayloadDto) {
    return {
      access_token: this.jwtService.sign(jwtPayload, {
        expiresIn: '15m',
        secret: 'secret',
      })
  }
}

  async registration(registrationDto: RegistrationDto) {
    let password = registrationDto.password;
    registrationDto.password = hashSync(password, genSaltSync());
    
    return await this.usersRepository.create(registrationDto)

  }
  async login(loginCredentialsDto: LoginCredentialsDto) {
    const { email, password } = loginCredentialsDto;
    const user = await this.usersRepository.findOneBy({
                                                        email,
                                                      });
    if (!user) {
      throw new BadRequestException(`User with email ${email} does not exist.`);
    }
    if (!( await bcrypt.compare(password, user.password) )) {
      throw new BadRequestException('Password are wrong.');
    }
    await this.usersRepository.save(user);
    
    return this.jwtSignTokens({ id: user.id });

  }

}
