import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSocketRoomDto{

    @ApiProperty({example: 'token...', description: 'User jwt token'})
    @IsString()
    token: string;
}