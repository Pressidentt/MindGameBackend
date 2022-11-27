import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TestDto{

    @IsNumber()
    @IsNotEmpty()
    boardId: number;
}