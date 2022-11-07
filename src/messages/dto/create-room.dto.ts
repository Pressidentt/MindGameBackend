import { IsString } from "class-validator";

export class CreateRoomDto {
    @IsString()
    boardPassword: string;

    @IsString()
    userToken: string;
}