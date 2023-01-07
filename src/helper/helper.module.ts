import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from "@nestjs/common";
import { BoardCards } from "../board/board-cards.model";
import { Board } from "../board/board.model";
import { HelperService } from "./helper.service";
import { UserCards } from '../user/user-card.model';

@Module({
    imports: [SequelizeModule.forFeature([BoardCards, Board, UserCards])],
    providers: [HelperService],
    exports: [HelperService]

})
export class HelperModule { }