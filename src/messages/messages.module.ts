import { MessagesService } from './messages.service';
import { Module } from "@nestjs/common";

@Module({
    imports: [],
    providers: [MessagesService, MessagesModule]
})
export class MessagesModule {}