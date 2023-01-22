import { LevelCardDivideDto } from './../board/dto/level-card-divide.dto';
import { BoardService } from './../board/board.service';
import { Injectable, UseFilters } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Socket } from 'socket.io'
import { BoardCards } from '../board/board-cards.model'
import { Board } from '../board/board.model'
import { UserCards } from '../user/user-card.model'
import { User } from '../user/user.model'

@Injectable()
export class HelperService {
  constructor(
    @InjectModel(Board) private boardRepository: typeof Board,
    @InjectModel(BoardCards) private boardCardRepository: typeof BoardCards,
    @InjectModel(UserCards) private userCard: typeof UserCards,
    @InjectModel(User) private userRepository: typeof User,
    private boardService: BoardService,
  ) { }

  async socketLeave(client: Socket) {
    let boardId = client.data.board
    client.leave(String(boardId))
    client.data.board = null
    return
  }

  async destroyRoom(boardId: number, client: Socket) {
    await this.deleteCardsFromBoard(boardId);
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      include: { all: true },
    })
    let users = board.users
    for (const user of users) {
      await this.deleteCardsFromUser(user.id)
      user.boardId = null
      await user.save()
    }
    await board.destroy()
    return await client.emit('roomDestroyed')
  }

  async removeOneUser(client: Socket) {
    const user = await this.userRepository.findOne({
      where: {
        socketId: client.id,
      },
      include: {
        all: true
      },
    });
    await this.deleteCardsFromUser(user.id)
    user.boardId = null
    await user.save()
    return await client.emit('disconnected')
  }

  async deleteCardsFromBoard(boardId: number) {
    const cardsToDelete = await this.boardCardRepository.destroy({
      where: { boardId },
    })
    return
  }

  async deleteCardsFromUser(userId: number) {
    const cardsToDelete = await this.userCard.destroy({
      where: { userId },
    })
    return
  }

  async nextLevel(boardId: number) {
    let curLevel = 0;
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      include: { all: true },
    })
    await this.deleteCardsFromBoard(boardId);
    if (board.numberOfLevels - board.currentLevel > 0) {
      curLevel = board.currentLevel; 
      board.currentLevel = board.currentLevel + 1;
      await board.save();
      let levelCardDivideDto = new LevelCardDivideDto();
      levelCardDivideDto.boardId = board.id;
      levelCardDivideDto.currentRoundNumber = curLevel + 1;
      levelCardDivideDto.numberOfPlayers = board.users.length;
      await this.boardService.cardDividerForNthRound(levelCardDivideDto);
      return 'nextLevel';
    }
    //Game Victory
    return board.currentLevel;
  }

  async levelCount(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      include: { all: true },
    })
    const numberOfPlayers = board.users.length
    const numberOfLevels3pl = 10
    const numberOfLevels2pl = 12

    const roomModeFor3 = 3
    const roomModeFor2 = 2

    let roomLevel = 0

    for (let i = 0; i <= numberOfPlayers; i++) {
      if (i === board.roomMode) {
        roomLevel = board.numberOfLevels
      } else if (i === roomModeFor3) {
        roomLevel = numberOfLevels3pl
      } else if (i === roomModeFor2) {
        roomLevel = numberOfLevels2pl
      }
    }

    return roomLevel
  }
}
