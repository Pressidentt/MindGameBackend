import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Card } from "./card.entity";

@Entity()
export class Board{
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  boardPassword: string;

    // Relations

  @OneToMany(() => User, (user) => user.board)
  user: User[];

  @OneToMany(() => Card, (card) => card.board)
  card: Card[];
}
