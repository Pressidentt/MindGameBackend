import { UserService } from './../user/user.service';
import { BoardCards } from './../board/board-cards.model';
import { UserCards } from './../user/user-card.model';
import { PlayCardDto } from './dto/play-card.dto';
import { BoardService } from './../board/board.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { Socket } from "socket.io";
import { Board } from "src/board/board.model";
import { Card } from "src/board/card.model";
import { User } from "src/user/user.model";
import { CreateSocketRoomDto } from "./dto/create-socket-room.dto";

@Injectable()
export class MessagesService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                @InjectModel(Board) private boardRepository: typeof Board,
                @InjectModel(Card) private cardRepository: typeof Card,
                @InjectModel(UserCards) private userCardRepository: typeof UserCards,
                @InjectModel(BoardCards) private boardCardRepository: typeof BoardCards,
                private jwtService: JwtService,
                private boardService: BoardService,
                private userService: UserService
    ) { }

    async listenBoard(client: Socket) {
        const user = await this.userRepository.findOne({
            where: { socketId: client.id }, include: { all: true }
        });
        const board = await this.boardRepository.findOne({
            where: { id: user.boardId }, include: { all: true }
        });

        const isIn: boolean = await this.boardService.isUserInRoom(board.id, user.id);
        if (!isIn) {
            throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
        }
        return board.cards;
    }

    async playCard(client: Socket, dto: PlayCardDto) {
        const user = await this.userRepository.findOne({ where: { socketId: client.id }, include: { all: true } })
        let check = await this.ruleChecker(dto.boardId, dto.cardId);
        const cardDeleteFromUser = await this.userCardRepository.destroy({ where: { cardId: dto.cardId, userId: user.id } })
        const cardForBoard = await this.boardCardRepository.create({ cardId: dto.cardId, boardId: dto.boardId });
        return await cardForBoard.save();
    }

    async ruleChecker(boardId: number, cardId: number) {
        const cardsUsersArr = []
        const userIds = await this.userService.idGetter(boardId)
        for (const user of userIds) {
            for (const card of user.cards) {
                cardsUsersArr.push(Number(card.id))
            }
        }
        if (cardsUsersArr.some((el) => el < cardId)) {
            throw new HttpException('GAME OVER!', HttpStatus.BAD_REQUEST);
        }
        return true;
    }

    async boardIdString(client: Socket) {
        return "boardId"
    }


    async socketCreateRoom(client: Socket) {
        if (!(client.handshake.query.token) || !(client.handshake.query.boardId)) {
            throw new HttpException('Bad request params', HttpStatus.BAD_REQUEST);
        }
        if (Array.isArray(client.handshake.query.token)) {
            throw new HttpException('Bad request params', HttpStatus.BAD_REQUEST);
        }
        const userToken: string = client.handshake.query.token;
        client.data.board = client.handshake.query.boardId;
        await this.boardRepository.create()
        const user = await this.jwtService.verifyAsync(userToken, { secret: process.env.PRIVATE_KEY });
        const boardId = client.handshake.query.boardId;
        const realUser = await this.userRepository.findOne({ where: { id: user.id }, include: { all: true } })
        realUser.socketId = client.id;
        await client.join(`${boardId}`);
        return await realUser.save();
    }

    async socketsLeave(socket: Socket, socketName: string) {
        await socket.leave(socketName);
    }
}
