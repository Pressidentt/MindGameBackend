import { BoardService } from './board.service';
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateRoomDto } from "src/messages/dto/create-room.dto";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Client } from 'src/user/decorators/user.decorator';
import { CardDivideDto } from './dto/card-divide.dto';


@ApiTags('Board/Card')
@Controller('board')
export class BoardController{
constructor (   private boardService: BoardService
) {}

    @ApiOperation({summary:'Create room(board), then should be transfered to socket{createRoom}'})
    @UseGuards(JwtAuthGuard)
    @Post('createRoom')
    async createRoom( @Body() createRoomDto: CreateRoomDto,
    @Client('id') userId: number ) {
        return await this.boardService.createRoom(createRoomDto, userId)
    }

    @ApiOperation({summary:'Join to the room(board), then should be transfered to socket{createRoom}'})
    @UseGuards(JwtAuthGuard)
    @Post('joinRoom')
    async joinRoom( @Body() createRoomDto: CreateRoomDto,
    @Client('id') userId: number ) {
        return await this.boardService.joinRoom(createRoomDto, userId)
    }

    @ApiOperation({summary:'Get list of all rooms'})
    @Get('allRooms')
    async allRooms() {
        return await this.boardService.allRooms()
    }

    @Post('/cardDivide')
    async testFunc(@Body() cardDivideDto: CardDivideDto) {
        return await this.boardService.cardDivider(cardDivideDto)
    }

    @Post('/seederCard')
    async seedIt() {
        return await this.boardService.createCardSeeder()
    }


}