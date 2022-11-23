import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Card } from "src/board/card.model";
import { User } from "./user.model";


@Table({ tableName: 'user_cards', createdAt: false, updatedAt: false })
export class UserCards extends Model<UserCards> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => Card)
    @Column({ type: DataType.INTEGER })
    cardId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

}
