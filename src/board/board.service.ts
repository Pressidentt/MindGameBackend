import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateRoomDto } from "src/messages/dto/create-room.dto";
import { User } from "src/user/user.model";
import { Board } from "./board.model";
import { Card } from "./card.model";

@Injectable()
export class BoardService {
    constructor(
             @InjectModel(User) private userRepository: typeof User,
             @InjectModel(Board) private boardRepository: typeof Board,
             @InjectModel(Card) private cardRepository: typeof Card,
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
}