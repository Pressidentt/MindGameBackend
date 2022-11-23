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
        private boardService: BoardService
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
        const user = await this.userRepository.findOne({ where: {socketId: client.id }, include: {all: true}})
        const cardDeleteFromUser = await this.userCardRepository.destroy({ where: {cardId: dto.cardId, userId: user.id}}) 
        const cardForBoard = await this.boardCardRepository.create({cardId: dto.cardId, boardId: dto.boardId });
        return await cardForBoard.save();
    }

    async boardIdString(client: Socket) {
        return "boardId"
    }


    async socketCreateRoom(createSocketRoomDto: CreateSocketRoomDto, client: Socket) {
        const token = createSocketRoomDto.token;
        const jwtUser = await this.jwtService.verify(token, { secret: process.env.PRIVATE_KEY })
        const realUser = await this.userRepository.findOne({ where: { id: jwtUser.id }, include: { all: true } })
        realUser.socketId = client.id;
        await client.join(`${createSocketRoomDto.boardId}`);
        await realUser.save();
        return realUser;
    }

    async socketsLeave(socket: Socket, socketName: string) {
       await socket.leave(socketName);
    }
}
