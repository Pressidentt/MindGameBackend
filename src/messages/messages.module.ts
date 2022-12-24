import { Card } from './../board/card.model';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { UserCards } from './../user/user-card.model';
import { BoardCards } from './../board/board-cards.model';
import { MessagesService } from './messages.service';
import { Module } from "@nestjs/common";
import { MessagesGateway } from './messages.gateaway';
import { BoardModule } from '../board/board.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { Board } from 'src/board/board.model';
import { UsersModule } from 'src/user/user.module';
import { AuthModule } from '../auth/auth.module';
import { HelperModule } from '../helper/helper.module';

@Module({
    imports: [BoardModule,
    SequelizeModule.forFeature([User, Board, BoardCards, UserCards, Card]),
    UsersModule,
    BoardModule,
    JwtModule,
    AuthModule,
    HelperModule
    ],
    providers: [MessagesService, MessagesGateway]
})
export class MessagesModule { }