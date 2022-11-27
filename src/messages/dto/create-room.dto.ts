import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateRoomDto{

    @ApiProperty({ example: 'from 2 to 6', description: 'Number of players in the room' })
    @IsNumber()
    numberOfPlayers: number;
}