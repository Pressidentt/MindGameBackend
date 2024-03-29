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
import { HelperService } from '../helper/helper.service';
import { v4 as uuid } from "uuid";

@Injectable()
export class MessagesService {

    constructor(@InjectModel(User) private userRepository: typeof User,
        @InjectModel(Board) private boardRepository: typeof Board,
        @InjectModel(Card) private cardRepository: typeof Card,
        @InjectModel(UserCards) private userCardRepository: typeof UserCards,
        @InjectModel(BoardCards) private boardCardRepository: typeof BoardCards,
        private jwtService: JwtService,
        private boardService: BoardService,
        private userService: UserService,
        private helperService: HelperService
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
        if (typeof check === 'number') {
            return check;
        }
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
            return false;
        }
        const nextLevelFunc = await this.helperService.nextLevel(boardId)
        if (nextLevelFunc) {
            return nextLevelFunc
        }
        return true;
    }

    async boardIdString(client: Socket) {
        return "boardId"
    }


    async socketCreateRoom(client: Socket) {
        if (!(client.handshake.query.token) || !(client.handshake.query.numberOfPlayers)) {
            throw new HttpException('Bad request params', HttpStatus.BAD_REQUEST);
        }
        if (Array.isArray(client.handshake.query.token)) {
            throw new HttpException('Bad request params', HttpStatus.BAD_REQUEST);
        }

        const userToken: string = client.handshake.query.token;
        const user = await this.jwtService.verifyAsync(userToken, { secret: process.env.PRIVATE_KEY });
        const realUser = await this.userRepository.findOne({ where: { id: user.id }, include: { all: true } })

        const roomMode = Number(client.handshake.query.numberOfPlayers);
        const generatedPassword = uuid();
        const board = await this.boardRepository.create({
            boardPassword: generatedPassword, roomMode
        });

        await board.save();
        const boardId = board.id;

        client.data.board = boardId;
        realUser.socketId = client.id;

        realUser.boardId = board.id;
        await realUser.save();
        board.createrUserId = realUser.id;

        await client.join(`${boardId}`);
        await realUser.save();

        return { board, generatedPassword };
    }

    async joinRoom(client: Socket) {
        if (!(client.handshake.query.token) || !(client.handshake.query.boardPassword)) {
            throw new HttpException('Bad request params', HttpStatus.BAD_REQUEST);
        }
        if (Array.isArray(client.handshake.query.token) || Array.isArray(client.handshake.query.boardId)) {
            throw new HttpException('Bad request params', HttpStatus.BAD_REQUEST);
        }

        const userToken: string = client.handshake.query.token;
        client.data.board = client.handshake.query.boardId;
        await this.boardRepository.create()
        const user = await this.jwtService.verifyAsync(userToken, { secret: process.env.PRIVATE_KEY });
        const realUser = await this.userRepository.findOne({ where: { id: user.id }, include: { all: true } })

        const boardPassword = client.handshake.query.boardPassword;
        const board = await this.boardRepository.findOne({
            where: { boardPassword: boardPassword }, include: { all: true }
        });
        if (!board) {
            throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
        }
        const boardId = board.id;

        client.data.board = boardId;
        realUser.socketId = client.id;
        realUser.boardId = board.id;
        await realUser.save();
        await client.join(`${boardId}`);

        return board;
    }

    async socketsLeave(socket: Socket, socketName: string) {
        await socket.leave(socketName);
    }
}
