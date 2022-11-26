import { Board } from './../board/board.model';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userRepositoty: typeof User,
        @InjectModel(Board) private readonly boardRepository: typeof Board,

    ) { }

    async idGetter(boardId: number) {
        let idsArray = [];
        const board = await this.boardRepository.findOne({ where: { id: boardId }, include: { all: true } });
        const roomUsers = board.users;
        for (let keys in roomUsers) {
            idsArray.push(Number(roomUsers[keys].id))
        }
        return idsArray;
    }

    async getUsers() {
        return await this.userRepositoty.findAll({ include: { all: true } })
    }
}