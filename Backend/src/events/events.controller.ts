import { Controller, Get, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
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
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      eventData.imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    }
    return this.eventsService.createEvent(eventData);
  }
}
