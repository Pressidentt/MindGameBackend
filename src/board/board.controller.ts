import { CreateRoomDto} from 'src/messages/dto/create-room.dto';
import { BoardService } from './board.service';
import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Client } from 'src/user/decorators/user.decorator';
import { CardDivideDto } from './dto/card-divide.dto';
import { JoinRoomDto } from 'src/messages/dto/join-room.dto';


@ApiTags('Board/Card')
@Controller('board')
export class BoardController {
    constructor(private boardService: BoardService
    ) { }

    @ApiOperation({ summary: 'Create room(board), then should be transfered to socket{createRoom}' })
    @UseGuards(JwtAuthGuard)
    @Post('createRoom')
    async createRoom(@Client('id') userId: number, @Body() createRoomDto: CreateRoomDto) {
        return await this.boardService.createRoom(userId, createRoomDto)
    }

    @ApiOperation({ summary: 'Join to the room(board), then should be transfered to socket{createRoom}' })
    @UseGuards(JwtAuthGuard)
    @Post('joinRoom')
    async joinRoom(@Body() joinRoomDto: JoinRoomDto,
        @Client('id') userId: number) {
        return await this.boardService.joinRoom(joinRoomDto, userId)
    }

    @ApiOperation({ summary: 'Get list of all rooms' })
    @Get('allRooms')
    async allRooms() {
        return await this.boardService.allRooms()
    }

    @UseGuards(JwtAuthGuard)
    @Post('/startGame')
    async testFunc(@Body() cardDivideDto: CardDivideDto,
        @Client('id') userId: number
    ) {
        // return await this.boardService.gameStart(userId, cardDivideDto)
    }

    @Post('/seederCard')
    async seedIt() {
        return await this.boardService.createCardSeeder()
    }

    @Get('/:id/getCards')
    async getUserCards(@Param('id', ParseIntPipe) userId: number) {
        return await this.boardService.getUserCards(userId)
    }

}