import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateRoomDto {

    @ApiProperty({example: '1234', description: 'Unic board(room) password'})
    @IsString()
    boardPassword: string;
}