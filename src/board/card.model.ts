import { BoardCards } from './board-cards.model';
import { UserCards } from './../user/user-card.model';
import { User } from '../user/user.model';
import {BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import { Board } from './board.model';

interface CardCreationAttrs {}

@Table({tableName: 'card'})
export class Card extends Model<Card, CardCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @BelongsToMany(() => User, () => UserCards)
    users: User[];

    @BelongsToMany(() => Board, () => BoardCards)
    boards: Board[];
}