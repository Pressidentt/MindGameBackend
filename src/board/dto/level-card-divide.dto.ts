import { IsNumber } from "class-validator";

export class LevelCardDivideDto {

    @IsNumber()
    currentRoundNumber: number;

    @IsNumber()
    boardId: number;

    @IsNumber()
    numberOfPlayers?: number;
}