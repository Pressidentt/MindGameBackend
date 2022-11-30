import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CardDivideLevelDto {
    @IsNumber()
    boardId: number;

    @IsNumber()
    levelNumber: number;
}