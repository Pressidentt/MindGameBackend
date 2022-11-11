import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {AuthService} from "./auth.service";
import {ApiOperation, ApiProperty, ApiTags} from "@nestjs/swagger";
import { LoginUserDto } from '../user/dto/login-user.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary:'User login'})
    @Post('/login')
    login(@Body() userDto: LoginUserDto) {
        return this.authService.login(userDto)
    }

    @ApiOperation({summary:'User registration'})
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto)
    }


}
