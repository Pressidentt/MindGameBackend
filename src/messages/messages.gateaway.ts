import { PlayCardDto } from './dto/play-card.dto';
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io'
import { Client } from '../user/decorators/user.decorator';
import { BoardService } from '../board/board.service';
import { CreateSocketRoomDto } from './dto/create-socket-room.dto';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

//  cors : {
//     origin: '*',
//   },
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5000'],
  },
})

export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService,
    private readonly boardService: BoardService,
    private readonly authService: AuthService,
    private jwtService: JwtService) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('listenToBoard')
  async listenBoard(@ConnectedSocket() client: Socket) {
    const user = await this.jwtService.verifyAsync(client.handshake.headers.authorization);
    return await this.messagesService.listenBoard(client);
  }

  @SubscribeMessage('playCard')
  async playCard(@ConnectedSocket() client: Socket, @MessageBody() dto: PlayCardDto) {
    let boardId = Number(dto.boardId);
    let card = await this.messagesService.playCard(client, dto);
    this.server.to(String(boardId)).emit('message', card);
  }

  @SubscribeMessage('testListen')
  testFunc() {
    return 'test Approved!'
  }

  @SubscribeMessage('createRoom')
  async createRoom(@ConnectedSocket() client: Socket) {

    return this.messagesService.socketCreateRoom(client)
  }

}
