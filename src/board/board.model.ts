import { BoardCards } from './board-cards.model';
import { User } from '../user/user.model';
import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import { Card } from './card.model';
import { ApiTags } from '@nestjs/swagger';

interface BoardCreationAttrs {
    boardPassword: string;
    roomMode?: number;
    numberOfRounds?: number;
}

@Table({tableName: 'board'})
export class Board extends Model<Board, BoardCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.INTEGER, allowNull: true})
    createrUserId: number;

    @Column({type: DataType.INTEGER, defaultValue: 8})
    numberOfLevels: number;

    @Column({type: DataType.INTEGER, defaultValue: 10})
    numberOfLevels3pl: number;

    @Column({type: DataType.INTEGER, defaultValue: 12})
    numberOfLevels2pl: number;

    @Column({type: DataType.INTEGER, defaultValue: 1})
    currentLevel: number;

    @Column({type: DataType.INTEGER, defaultValue: 4})
    roomMode: number;

    @Column({type: DataType.INTEGER, defaultValue: 3})
    roomModeFor3: number;

    @Column({type: DataType.INTEGER, defaultValue: 2})
    roomModeFor2: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    boardPassword: string;

    @BelongsToMany(() => Card, () => BoardCards)
    cards: Card[];

    @HasMany(() => User)
    users: User[];
}