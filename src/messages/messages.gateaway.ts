import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io'
import { CreateRoomDto } from './dto/create-room.dto';

//  cors : {
//     origin: '*',
//   },
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
 
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}
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

//   @SubscribeMessage('listenToBoard')
//   findOne(@MessageBody() id: number) {
//     return this.messagesService.findOne(id);
//   }

    @SubscribeMessage('testListen')
    testFunc() {
      return 'test Approved!'
    }

}
