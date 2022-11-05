import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {Server, Socket} from 'socket.io'


@WebSocketGateway({
  cors : {
    origin: '*',
  },
})
@WebSocketGateway()
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createRoom')
  create(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    return this.messagesService.create(createMessageDto, client);
  }

  @SubscribeMessage('joinRoom')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('listenToBoard')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

}
