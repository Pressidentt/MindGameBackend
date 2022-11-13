import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { Socket } from "socket.io";
import { CreateRoomDto } from "src/messages/dto/create-room.dto";
import { User } from "src/user/user.model";
import { CreateSocketRoomDto } from "../messages/dto/create-socket-room.dto";
import { Board } from "./board.model";
import { Card } from "./card.model";

@Injectable()
export class BoardService {
    constructor(
             @InjectModel(User) private userRepository: typeof User,
             @InjectModel(Board) private boardRepository: typeof Board,
             @InjectModel(Card) private cardRepository: typeof Card,
             private jwtService: JwtService
    ) {}

    async createRoom(createRoomDto: CreateRoomDto, userId: number) {

    const board = await this.boardRepository.create({boardPassword: createRoomDto.boardPassword});
    const realUser = await this.userRepository.findOne({where: {id: userId}, include: {all:true}})
    realUser.boardId = board.id;
    await realUser.save();
    return board;
    }

    async joinRoom(createRoomDto: CreateRoomDto, userId: number) {

    const board = await this.boardRepository.findOne({
        where: {boardPassword: createRoomDto.boardPassword}, include: {all: true}
    })
    const realUser = await this.userRepository.findOne({where: {id: userId}, include: {all:true}})
    realUser.boardId = board.id;
    await realUser.save();
    return board;
    }

    async allRooms() {
        return await this.boardRepository.findAll({include: {all: true}})
    }

    async createCardSeeder() {
        for(let i = 0; i< 100; i++) {
            let card = await this.cardRepository.create();
        }
        return 'done'
    }

    async socketCreateRoom(createSocketRoomDto: CreateSocketRoomDto, client: Socket) {

        const token = createSocketRoomDto.token;
        const jwtUser = await this.jwtService.verify(token, { secret: process.env.PRIVATE_KEY })
        const realUser = await this.userRepository.findOne({where: { id: jwtUser.id}, include: {all: true}}) 
        realUser.socketId = client.id;
        await realUser.save();
        return realUser;

    }
    
}