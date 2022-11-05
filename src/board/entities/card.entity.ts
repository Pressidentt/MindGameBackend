import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Board } from "./board.entity";

@Entity()
export class Card{
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

    // Relations

  @ManyToOne(() => Board)
  board: Board;

  @ManyToOne(()=> User)
  user: User;
}
