import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsEmail()
    name: string;

    @IsString()
    password: string;
}