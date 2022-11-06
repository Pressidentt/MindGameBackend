import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { Card } from "src/board/card.model";
import { Board } from "./board.model";


@Table({tableName: 'board_cards', createdAt: false, updatedAt: false})
export class BoardCards extends Model<BoardCards> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER})
    cardId: number;

    @ForeignKey(() => Board)
    @Column({type: DataType.INTEGER})
    boardId: number;

}
