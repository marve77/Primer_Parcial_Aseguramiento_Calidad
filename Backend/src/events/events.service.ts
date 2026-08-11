import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async getEvents(): Promise<Event[]> {
    return this.eventsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: {
        author: {
          carrera: true,
        },
      },
    });
  }

  async createEvent(eventData: Partial<Event>, authorId: string): Promise<Event> {
    const event = this.eventsRepository.create({
      ...eventData,
      author: { id: authorId } as any
    });
    return this.eventsRepository.save(event);
  }

  async getEventById(id: string): Promise<Event | null> {
    return this.eventsRepository.findOne({ where: { id } });
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    await this.eventsRepository.update(id, eventData);
    return this.eventsRepository.findOneOrFail({ where: { id } });
  }

  async deleteEvent(id: string): Promise<void> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) return;

    if (event.imageUrl) {
      const filename = event.imageUrl.split('/').pop();
      if (filename) {
        const filePath = join(process.cwd(), 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await this.eventsRepository.delete(id);
  }
}
