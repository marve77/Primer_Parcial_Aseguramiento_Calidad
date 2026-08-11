import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  date: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  category: string;

  @CreateDateColumn()
  createdAt: Date;
}
