import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class PlayCardDto{

    @ApiProperty({example: '4', description: 'Board Id'})
    @IsNumber()
    boardId: number;

    @ApiProperty({example: '4', description: 'Card number put by user'})
    @IsNumber()
    cardId: number;

}