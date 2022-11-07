import { MessagesService } from './messages.service';
import { Module } from "@nestjs/common";
import { MessagesGateway } from './messages.gateaway';

@Module({
    imports: [],
    providers: [MessagesService, MessagesGateway]
})
export class MessagesModule {}