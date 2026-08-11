import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, NotFoundException, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import * as fs from 'fs';

// Asegurar que la carpeta uploads exista
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getEvents() {
    return this.eventsService.getEvents();
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles('Administrador')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: uploadDir,
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    })
  }))
  async createEvent(
    @Body() eventData: Partial<Event>,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    if (file) {
      eventData.imageUrl = `/api/uploads/${file.filename}`;
    }
    const userId = req.user?.sub;
    return this.eventsService.createEvent(eventData, userId);
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    const event = await this.eventsService.getEventById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles('Administrador')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: uploadDir,
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    })
  }))
  async updateEvent(
    @Param('id') id: string,
    @Body() eventData: Partial<Event>,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      eventData.imageUrl = `/api/uploads/${file.filename}`;
    }
    return this.eventsService.updateEvent(id, eventData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles('Administrador')
  async deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }
}
