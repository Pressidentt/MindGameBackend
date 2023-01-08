import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class JoinRoomDto {

    @ApiProperty({ example: '1234', description: 'Unic board(room) password' })
    @IsString()
    boardPassword: string;

    @ApiProperty({ example: '1234', description: 'jwt token' })
    @IsString()
    token: string;

}