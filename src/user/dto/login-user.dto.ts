import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class LoginUserDto{

    @ApiProperty({example: 'putin@mail.ru', description: 'Users email'})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({example: 'Putin', description: 'Users password'})
    @IsString()
    password: string;
}