import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "../../board/entities/board.entity";
import { Card } from "../../board/entities/card.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' , nullable: true})
  socketId: string;

    // Relations

  @ManyToOne(() => Board)
  board: Board;

  @OneToMany(() => Card, (card) => card.user)
  user: User[];
  
}
