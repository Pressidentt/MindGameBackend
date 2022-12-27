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

}
