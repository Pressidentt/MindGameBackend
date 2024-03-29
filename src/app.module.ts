import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { MessagesModule } from './messages/messages.module';
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
           envFilePath: `.env.${process.env.NODE_ENV}`
        }),
    SequelizeModule.forRoot({
            dialect: 'postgres',
            protocol: 'postgres',
            host: process.env.PGHOST,
            port: Number(process.env.PGPORT),
            username: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            models: [User, Board, Card, UserCards, BoardCards],
            autoLoadModels: true
        }),
       MessagesModule,
       BoardModule,
       UsersModule,
       AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
