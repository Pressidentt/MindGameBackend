import { Board } from './board.model';
import { BoardService } from './board.service';
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Card } from './card.model';

@Module({
  providers: [BoardService],
  imports: [
      SequelizeModule.forFeature([Board, Card]),
  ],
})
export class BoardModule{}
