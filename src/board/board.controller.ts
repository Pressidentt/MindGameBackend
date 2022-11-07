import { BoardService } from './board.service';
import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateRoomDto } from "src/messages/dto/create-room.dto";
import { get } from 'http';

@Controller('board')
export class BoardController{
constructor (   private boardService: BoardService
) {}

    @Post('createRoom')
    async createRoom( @Body() createRoomDto: CreateRoomDto ) {
        return await this.boardService.createRoom(createRoomDto)
    }

    @Post('joinRoom')
    async joinRoom( @Body() createRoomDto: CreateRoomDto ) {
        return await this.boardService.joinRoom(createRoomDto)
    }

    @Get()
    async allRooms() {
        return await this.boardService.allRooms()
    }


}