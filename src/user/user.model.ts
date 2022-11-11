import { UserCards } from './user-card.model';
import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import { Card } from 'src/board/card.model';
import { Board } from 'src/board/board.model';

interface UserCreationAttrs {
    email: string;
    password: string;
    name: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @Column({type: DataType.STRING })
    name: string;

    @Column({type: DataType.STRING, allowNull: true})
    socketId: string;

    @BelongsToMany(() => Card, () => UserCards)
    cards: Card[];

    @ForeignKey(() => Board)
    @Column({type: DataType.INTEGER})
    boardId: number;

    @BelongsTo(() => Board)
    theBoard: Board;
}
