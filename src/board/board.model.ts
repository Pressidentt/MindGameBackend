import { BoardCards } from './board-cards.model';
import { User } from '../user/user.model';
import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import { Card } from './card.model';

interface BoardCreationAttrs {
    boardPassword: string;
}
@Table({tableName: 'board'})
export class Board extends Model<Board, BoardCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    boardPassword: string;

    @BelongsToMany(() => Card, () => BoardCards)
    cards: Card[];

    @HasMany(() => User)
    users: User[];
}