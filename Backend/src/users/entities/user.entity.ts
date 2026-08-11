import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Carrera } from './carrera.entity';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column({ default: 'Estudiante' })
  role: string;

  @ManyToOne(() => Carrera, (carrera) => carrera.usuarios, { nullable: true })
  carrera: Carrera;

  @OneToMany(() => Event, (event) => event.author)
  events: Event[];
}
