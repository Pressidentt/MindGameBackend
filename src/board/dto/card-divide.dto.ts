import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CardDivideDto{
    @IsString()
    boardId: string;
}