import { Board } from './../board/board.model';
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserController } from "./user.controller";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, Board]),
  ],
  exports: [UserService]
})
export class UsersModule { }
