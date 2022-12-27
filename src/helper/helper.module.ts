import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from "@nestjs/common";
import { BoardCards } from "../board/board-cards.model";
import { Board } from "../board/board.model";
import { HelperService } from "./helper.service";

@Module({
    imports: [SequelizeModule.forFeature([BoardCards, Board,])],
    providers: [HelperService],
    exports: [HelperService]

})
export class HelperModule { }