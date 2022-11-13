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

  // @SubscribeMessage('createRoom')
  // createRoom(@MessageBody() createRoomDto: CreateRoomDto ) {
  //   return this.messagesService.create(createRoomDto);
  // }

  

//   @SubscribeMessage('joinRoom')
//   findAll() {
//     return this.messagesService.findAll();
//   }

  @SubscribeMessage('listenToBoard')
  findOne() {
    //return this.messagesService.findOne(id);
  }

    @SubscribeMessage('testListen')
    testFunc() {
      return 'test Approved!'
    }

    @SubscribeMessage('createRoom')
    createRoom(@MessageBody() createSocketRoomDto: CreateSocketRoomDto, @ConnectedSocket() client: Socket) {
      return this.boardService.socketCreateRoom(createSocketRoomDto, client)
    }
    
}
