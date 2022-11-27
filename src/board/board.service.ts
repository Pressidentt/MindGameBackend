import { CreateRoomDto } from 'src/messages/dto/create-room.dto';
import { UserCards } from './../user/user-card.model';
import { UserService } from 'src/user/user.service';
import { CardDivideDto } from './dto/card-divide.dto';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { JoinRoomDto } from 'src/messages/dto/join-room.dto';
import { User } from "src/user/user.model";
import { Board } from "./board.model";
import { Card } from "./card.model";
import { v4 as uuid } from "uuid";

@Injectable()
export class BoardService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Board) private boardRepository: typeof Board,
        @InjectModel(Card) private cardRepository: typeof Card,
        @InjectModel(UserCards) private cardUserCardRepository: typeof UserCards,
        private jwtService: JwtService,
        private userSerive: UserService
    ) { }

    async createRoom(userId: number, createRoomDto: CreateRoomDto) {
        const generatedPassword = uuid();
        const board = await this.boardRepository.create({
            boardPassword: generatedPassword, roomMode: createRoomDto.numberOfPlayers
        });
        const realUser = await this.userRepository.findOne({ 
            where: { id: userId }, include: { all: true } 
        })
        realUser.boardId = board.id;
        await realUser.save();
        board.createrUserId = realUser.id;
        await board.save();

        return { board, generatedPassword };
    }

    async joinRoom(joinRoomDto: JoinRoomDto, userId: number) {
        const board = await this.boardRepository.findOne({
            where: { boardPassword: joinRoomDto.boardPassword }, include: { all: true }
        });
        const numberOfPlayers = board.users.length;

        if (!(board.roomMode - numberOfPlayers)) {
            throw new HttpException('Room is full', HttpStatus.BAD_REQUEST);
        }

        const realUser = await this.userRepository.findOne({ where: { id: userId }, include: { all: true } })
        realUser.boardId = board.id;
        await realUser.save();
        return board;
    }

    async allRooms() {
        return await this.boardRepository.findAll({ include: { all: true } });
    }

    async isUserInRoom(boardId: number, userId: number): Promise<boolean> {
        const ids = await this.userSerive.idGetter(boardId);
        if (ids.some((elem) => elem === userId)) {
            return true;
        }
        return false;

    }

    async createCardSeeder() {
        for (let i = 0; i < 100; i++) {
            let card = await this.cardRepository.create();
        }
        return 'done'
    }

    async gameStart(userId: number, cardDivideDto: CardDivideDto) {
        const boardId = Number(cardDivideDto.boardId);
        const realUser = await this.userRepository.findOne({ where: { id: userId }, include: { all: true } })
        const board = await this.boardRepository.findOne({ where: { id: boardId }, include: { all: true } })
        const numberOfPlayers = board.users.length;

        if (realUser.id !== board.createrUserId) {
            throw new HttpException('The game can be started only by its creator', HttpStatus.BAD_REQUEST);
        }
        if (numberOfPlayers !== board.roomMode) {
            throw new HttpException('Not enough number of players', HttpStatus.BAD_REQUEST);
        }

        const dto = new CardDivideDto;
        dto.boardId = board.id;
        dto.numberOfPlayers = board.roomMode;
        const cardDivide = await this.cardDivider(dto);

        return cardDivide;
    }

    //gameFunc(cardDivider, then listenBoard, putCard)
    async cardDivider(cardDivideDto: CardDivideDto) {
        const boardId = Number(cardDivideDto.boardId);
        const numberOfPlayers = Number(cardDivideDto.numberOfPlayers);
        const idsArr = await this.userSerive.idGetter(boardId)
        const cardArr = [];
        for (let i = 0; i < numberOfPlayers; i++) {
            let cardNum = Math.floor(Math.random() * 101);
            if (cardArr.some((elem) => elem == cardNum)) {
                i--;
            }
            else {
                cardArr.push(cardNum)
            }
        }
        for (let i = 0; i < numberOfPlayers; i++) {
            let user = await this.userRepository.findOne({ where: { id: idsArr[i] }, include: { all: true } });
            let card = await this.cardRepository.findOne({ where: { id: cardArr[i] }, include: { all: true } });
            let userCard = await this.cardUserCardRepository.create({
                userId: user.id,
                cardId: card.id
            })
            await userCard.save();
        }
    }

}