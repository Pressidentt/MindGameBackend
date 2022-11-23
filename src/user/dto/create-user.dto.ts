import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {

    @ApiProperty({example: 'putin@mail.ru', description: 'Users email'})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({example: 'Putin', description: 'Users name'})
    @IsString()
    name: string;

    @ApiProperty({example: 'Putin', description: 'Users password'})
    @IsString()
    password: string;
}