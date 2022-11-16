import { Injectable } from "@nestjs/common";
import { ConnectedSocket } from "@nestjs/websockets";

@Injectable()
export class MessagesService {

//     constructor(@InjectModel(User) private userRepository: typeof User,
//                 @InjectModel(Board) private boardRepository: typeof Board,
//                 @InjectModel(Card) private cardRepository: typeof Card,
//                 private jwtService: JwtService
// ) {}




//   async create(createRoomDto: CreateRoomDto ) {
    
//   }
    async listenBoard(@ConnectedSocket() client) {
        
    }
}
