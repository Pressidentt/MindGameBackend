import { BoardCards } from './board/board-cards.model';
import { UserCards } from './user/user-card.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.model';
import { Board } from './board/board.model';
import { Card } from './board/card.model';
import {ConfigModule} from "@nestjs/config";


@Module({
  imports: [
    ConfigModule.forRoot({
           envFilePath: `.${process.env.NODE_ENV}.env`
        }),
    SequelizeModule.forRoot({
            dialect: 'postgres',
            protocol: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Board, Card, UserCards, BoardCards],
            autoLoadModels: true
        }),
        
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
