import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private jwtService: JwtService) {}

    async login(userDto: LoginUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userRepository.findOne({where: {email: userDto.email}, include: {all: true}})
        if (candidate) {
            throw new HttpException('User with email already exists', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);

        const user = await this.userRepository.create({...userDto, password: hashPassword})
        if (user) {
            return user
        }
        return 'Registration was done successfully'
    }
    
    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id }
        return {
            token: this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY})
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userRepository.findOne({where: {email: userDto.email}, include: {all: true}})

        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Wrong email or password'})
    }

}
