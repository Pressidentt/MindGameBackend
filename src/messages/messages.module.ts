import { MessagesService } from './messages.service';
import { Module } from "@nestjs/common";
import { MessagesGateway } from './messages.gateaway';
import { BoardModule } from '../board/board.module';

@Module({
    imports: [BoardModule],
    providers: [MessagesService, MessagesGateway]
})
export class MessagesModule {}