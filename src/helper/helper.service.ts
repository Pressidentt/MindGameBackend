import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Socket } from "socket.io";
import { BoardCards } from "../board/board-cards.model";
import { Board } from "../board/board.model";
import { Card } from "../board/card.model";
import { UserService } from "../user/user.service";

@Injectable()
export class HelperService {
    constructor(@InjectModel(Board) private boardRepository: typeof Board,
        @InjectModel(Card) private cardRepository: typeof Card,
        @InjectModel(BoardCards) private boardCardRepository: typeof BoardCards,
        private userService: UserService
    ) { }

    async socketLeave(client: Socket) {
        let boardId = client.data.board;
        client.leave(String(boardId))
        client.data.board = null;
        return;
    }

    async deleteCardsFromBoard(boardId: number) {
        const cardsToDelete = await this.boardCardRepository.destroy({
            where: { boardId }
        });
        return;
    }

    async nextLevel(boardId: number, currentRoundNumber: number) {
        const board = await this.boardRepository.findOne({
            where: { id: boardId }, include: { all: true }
        });
        await this.deleteCardsFromBoard(boardId);
        if (board.numberOfLevels - currentRoundNumber) {
            board.currentLevel = currentRoundNumber++;
            await board.save();
            return ;
        }
        //Game Victory
        return board.currentLevel;
    }

    async levelCount(boardId: number) {
        const board = await this.boardRepository.findOne({
            where: { id: boardId }, include: { all: true }
        });
        const numberOfPlayers = board.users.length;
        let roomLevel = 0;
        for(let i = 0; i <= numberOfPlayers; i++) {
            if(i === board.roomMode) {
                roomLevel = board.numberOfLevels;
            }
            else if(i === board.roomModeFor3) {
                roomLevel = board.numberOfLevels3pl;
            }
            else if(i === board.roomModeFor2) {
                roomLevel = board.numberOfLevels2pl;
            }
        }
        
        return roomLevel;
    }
}
