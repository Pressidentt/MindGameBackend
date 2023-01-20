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
import { JoinRoomDto } from './dto/join-room.dto';

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
        let check: any = await this.ruleChecker(dto.boardId, dto.cardId);
        if (typeof check === 'number') {
            return true;
        }
        if (check === false) {
            return false;
        }
        const cardDeleteFromUser = await this.userCardRepository.destroy({ where: { cardId: dto.cardId, userId: user.id } })
        const cardForBoard = await this.boardCardRepository.create({ cardId: dto.cardId, boardId: dto.boardId });
        return await cardForBoard.save();
    }

    async ruleChecker(boardId: number, cardId: number): Promise<any>{
        const cardsUsersArr = []
        const userIds = await this.userService.idGetter(boardId)
        for (const user of userIds) {
            let userCards = await this.userCardRepository.findAll({ where: { userId: user }, include: { all: true } })
            for (const card of userCards) {
                cardsUsersArr.push(Number(card.cardId))
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


    async socketCreateRoom(client: Socket, dto: CreateSocketRoomDto) {
        // if (!(client.handshake.query.token) || !(client.handshake.query.numberOfPlayers)) {
        //     throw new HttpException('Bad request params', HttpStatus.BAD_REQUEST);
        // }
        // if (Array.isArray(client.handshake.query.token)) {
        //     throw new HttpException('Bad request params', HttpStatus.BAD_REQUEST);
        // }

        // const roomMode = Number(client.handshake.query.numberOfPlayers);
        // const userToken: string = client.handshake.query.token;
        const roomMode = Number(dto.numberOfPlayers);
        const userToken: string = dto.token;
        const user = await this.jwtService.verifyAsync(userToken, { secret: process.env.PRIVATE_KEY || 'secret' });
        const realUser = await this.userRepository.findOne({ where: { id: user.id }, include: { all: true } })

        const generatedPassword = uuid();
        const board = await this.boardRepository.create({
            boardPassword: generatedPassword, roomMode, createrUserId: realUser.id 
        });
        await board.save();

        const boardId = board.id;

        // client.data.board = boardId;
        realUser.socketId = client.id;
        realUser.boardId = board.id;

        await realUser.save();
        await client.join(`${boardId}`);

        return await client.emit('generatedPassword', generatedPassword);
    }

    async joinRoom(client: Socket, dto: JoinRoomDto) {
        // if (!(client.handshake.query.token) || !(client.handshake.query.boardPassword)) {
        //     throw new HttpException('Bad request params', HttpStatus.BAD_REQUEST);
        // }
        // if (Array.isArray(client.handshake.query.token) || Array.isArray(client.handshake.query.boardId)) {
        //     throw new HttpException('Bad request params', HttpStatus.BAD_REQUEST);
        // }

        // const userToken: string = client.handshake.query.token;

        // client.data.board = boardId;
        // client.data.board = client.handshake.query.boardId;
        // const boardPassword = client.handshake.query.boardPassword;
        // const userToken: string = client.handshake.query.token;
        const userToken = dto.token;
        const boardPassword = dto.boardPassword;
        const user = await this.jwtService.verifyAsync(userToken, { secret: process.env.PRIVATE_KEY || 'secret' });
        const realUser = await this.userRepository.findOne({ where: { id: user.id }, include: { all: true } })

        let board = await this.boardRepository.findOne({
            where: { boardPassword: boardPassword }, include: { all: true }
        });
        if (!board) {
            throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
        }
        const boardId = board.id;

        realUser.socketId = client.id;
        realUser.boardId = board.id;
        await realUser.save();
        await client.join(`${boardId}`);

        board = await this.boardRepository.findOne({
            where: { id: boardId }, include: { all: true }
        });
        await client.emit('joinedRoom', board);
        return {boardId, board};
    }

    async socketsLeave(socket: Socket, socketName: string) {
        await socket.leave(socketName);
    }
}
