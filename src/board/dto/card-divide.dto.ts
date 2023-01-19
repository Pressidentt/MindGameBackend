import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length} from "class-validator";

export class CardDivideDto{

    @IsNotEmpty()
    @IsNumber()
    boardId: number;

    @IsOptional()
    @IsNumber()
    numberOfPlayers?: number;
}