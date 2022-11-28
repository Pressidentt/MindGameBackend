import { IsNumber } from "class-validator";

export class LevelCardDivideDto {
    
    @IsNumber()
    roundNumber: number;

    @IsNumber()
    boardId: number;

    @IsNumber()
    numberOfPlayers?: number;
}