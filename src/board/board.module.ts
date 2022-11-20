import { UserCards } from './../user/user-card.model';
import { UsersModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { BoardController } from './board.controller';
import { Board } from './board.model';
import { BoardService } from './board.service';
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Card } from './card.model';
import { User } from 'src/user/user.model';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
  imports: [
      SequelizeModule.forFeature([Board, Card, User, UserCards]),
      JwtModule,
      UsersModule,
  ],
  exports: [BoardService]
})
export class BoardModule{}
