import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {Server, Socket} from 'socket.io'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Board } from '../board/entities/board.entity';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MessagesService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
              @InjectRepository(Board) private readonly boardRepository: Repository<Board>,
              private readonly jwtService: JwtService,
) {}


  async create(createMessageDto: CreateMessageDto, client: Socket) {
     const payload: JwtPayloadDto = await this.jwtService.verifyAsync(createMessageDto.token, { secret: 'secret'});
      const { id } = payload;
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!user) throw new UnauthorizedException();
      user.socketId = client.id;

      let board = await this.boardRepository.create({})
  }


  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
