import { JoinRoomDto } from 'src/messages/dto/join-room.dto'
import { PlayCardDto } from './dto/play-card.dto'
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets'
import { MessagesService } from './messages.service'
import { Server, Socket } from 'socket.io'
import { Client } from '../user/decorators/user.decorator'
import { BoardService } from '../board/board.service'
import { CreateSocketRoomDto } from './dto/create-socket-room.dto'
import { AuthService } from '../auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { HelperService } from '../helper/helper.service'
import { HttpException, HttpStatus } from '@nestjs/common'

//  cors : {
//     origin: '*',
//   },
@WebSocketGateway({
  cors: {
    origin: ['*'],
  },
})
export class MessagesGateway {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly boardService: BoardService,
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private helperService: HelperService,
  ) { }

  @WebSocketServer()
  server: Server

  @SubscribeMessage('listenToBoard')
  async listenBoard(@ConnectedSocket() client: Socket) {
    const user = await this.jwtService.verifyAsync(
      client.handshake.headers.authorization,
      { secret: process.env.JWT_SECRET || 'secret' },
    )
    const cards = await this.messagesService.listenBoard(client)
    return await client.emit('message', cards)
  }

  @SubscribeMessage('playCard')
  async playCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: PlayCardDto,
  ) {
    let boardId = Number(dto.boardId)
    let card = await this.messagesService.playCard(client, dto)
    if (card === false) {
      let dto = {
        boardId: boardId
      }
      await this.leaveRoom(client, dto)
      await client.emit('Game Over', 'Game over')
      return await this.server.to(String(boardId)).emit('Game Over', 'Game over')
    } else if (card === true) {
      await client.emit('Victory', 'Victory')
      this.server.to(String(boardId)).emit('Victory', 'Victory')
    }
    else {
      await this.server.to(String(boardId)).emit('cardPlayed', card);
    }
  }

  @SubscribeMessage('testListen')
  testFunc() {
    return 'test Approved!'
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateSocketRoomDto,
  ) {
    return this.messagesService.socketCreateRoom(client, dto)
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    let result = await this.messagesService.joinRoom(client, dto)
    const boardId = result.boardId
    const board = result.board
    await this.server
      .to(String(boardId))
      .emit('message', board)
  }

  @SubscribeMessage('leaveRoomAll')
  async leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() dto: any) {
    let boardId = Number(dto.boardId);
    await this.server.socketsLeave(String(boardId))
    return await this.helperService.destroyRoom(Number(boardId), client)
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoomOne(@ConnectedSocket() client: Socket) {
    let boardId = client.handshake.query.boardId
    await this.helperService.removeOneUser(client);
    await this.helperService.socketLeave(client);
    return await this.server.to(String(boardId)).emit('User disconnected', 'User disconnected')
  }
  @SubscribeMessage('gameStart')
  async gameStart(@ConnectedSocket() client: Socket, @MessageBody() dto: any) {
    let boardId = Number(dto.boardId)
    const token: string = dto.token;
    await this.boardService.gameStart(token, boardId, client)
    return await this.server.to(String(boardId)).emit('GAME STARTED!', 'GAME STARTED!')
  }
}
