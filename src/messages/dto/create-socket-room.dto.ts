import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateSocketRoomDto{

    @ApiProperty({example: 'token...', description: 'User jwt token'})
    @IsString()
    token: string;

    @ApiProperty({example: '4', description: 'Board Id'})
    @IsNumber()
    numberOfPlayers: number;
}