import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io'
import { CreateRoomDto } from './dto/create-room.dto';
import { Client } from '../user/decorators/user.decorator';
import { BoardService } from '../board/board.service';
import { CreateSocketRoomDto } from './dto/create-socket-room.dto';

//  cors : {
//     origin: '*',
//   },
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
 
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService,
              private readonly boardService: BoardService) {}

    @WebSocketServer()
    server: Server;

  @SubscribeMessage('listenToBoard')
    listenBoard(@ConnectedSocket() client: Socket) {
      return this.messagesService.listenBoard(client);
  }

  @SubscribeMessage('playCard')
    async playCard(@ConnectedSocket() client: Socket) {
      let boardId = await this.messagesService.boardIdString(client);
      //TODO
      let card = await this.messagesService.playCard(client);
      this.server.to(boardId).emit('message', card);
      //TODO
  }

  @SubscribeMessage('testListen')
    testFunc() {
        return 'test Approved!'
    }

    @SubscribeMessage('createRoom')
      createRoom(@MessageBody() createSocketRoomDto: CreateSocketRoomDto, @ConnectedSocket() client: Socket) {
        return this.messagesService.socketCreateRoom(createSocketRoomDto, client)
    }
    
}
