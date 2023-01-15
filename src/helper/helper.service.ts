import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Socket } from "socket.io";
import { BoardCards } from "../board/board-cards.model";
import { Board } from "../board/board.model";

@Injectable()
export class HelperService {
    constructor(@InjectModel(Board) private boardRepository: typeof Board,
        @InjectModel(BoardCards) private boardCardRepository: typeof BoardCards,
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

    async removeLive(boardId: number) {
        const board = await this.boardRepository.findOne({
            where: { id: boardId }, include: { all: true }
        });

        if (board.numOfLives == 0) {

        }
        else {
            board.numOfLives
        }
    }

    async nextLevel(boardId: number) {
        const board = await this.boardRepository.findOne({
            where: { id: boardId }, include: { all: true }
        });
        await this.deleteCardsFromBoard(boardId);
        if (board.numberOfLevels - board.currentLevel) {
            board.currentLevel = board.currentLevel++;
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

        const numberOfLevels3pl = 10;
        const numberOfLevels2pl = 12;

        const numberOfPlayers = board.users.length;
        const roomModeFor3 = 3;
        const roomModeFor2 = 2;

        let roomLevel = 0;

        for(let i = 0; i <= numberOfPlayers; i++) {
            if(i === board.roomMode) {
                roomLevel = board.numberOfLevels;
            }
            else if(i === roomModeFor3) {
                roomLevel = numberOfLevels3pl;
            }
            else if(i === roomModeFor2) {
                roomLevel = numberOfLevels2pl;
            }
        }

        return roomLevel;
    }

    async livesCount(boardId: number) {
        const board = await this.boardRepository.findOne({
            where: { id: boardId }, include: { all: true }
        });

        const numberOfPlayers = board.users.length;
        const roomModeFor3 = 3;
        const roomModeFor2 = 2;

        const livesMode3 = 3;
        const livesMode2 = 2;

        let roomLives = 0;

        for(let i = 0; i <= numberOfPlayers; i++) {
            if(i === board.roomMode) {
                roomLives = board.numOfLives;
            }
            else if(i === roomModeFor3) {
                roomLives = livesMode3;
            }
            else if(i === roomModeFor2) {
                roomLives = livesMode2;
            }
        }

        return roomLives;
    }
}
