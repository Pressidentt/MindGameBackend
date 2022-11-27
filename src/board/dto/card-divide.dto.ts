import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CardDivideDto{

    @IsNumber()
    boardId: number;

    @IsNumber()
    numberOfPlayers?: number;
}