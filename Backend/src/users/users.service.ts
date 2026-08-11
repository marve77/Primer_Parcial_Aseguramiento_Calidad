import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Carrera } from './entities/carrera.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Carrera)
    private carrerasRepository: Repository<Carrera>,
  ) {}

  async onModuleInit() {
    // 1. Insertar las carreras
    const carrerasNombres = [
      'Ingenieria en sisteams Jm',
      'Odontologia',
      'Chef Internacional'
    ];

    for (const nombre of carrerasNombres) {
      let carrera = await this.carrerasRepository.findOneBy({ nombre });
      if (!carrera) {
        carrera = this.carrerasRepository.create({ nombre });
        await this.carrerasRepository.save(carrera);
        this.logger.log(`Carrera insertada: ${nombre}`);
      }
    }

    // Obtener la carrera para el admin
    const carreraSistemas = await this.carrerasRepository.findOneBy({ nombre: 'Ingenieria en sisteams Jm' });

    // 2. Insertar o actualizar el usuario administrador
    const adminEmail = 'admin@miumg.edu.gt';
    let adminUser = await this.usersRepository.findOne({ where: { email: adminEmail }, relations: { carrera: true } });
    
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = this.usersRepository.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'Administrador',
        carrera: carreraSistemas || undefined,
      });
      await this.usersRepository.save(adminUser);
      this.logger.log(`Usuario Administrador por defecto creado: ${adminEmail} / admin123 con carrera ${carreraSistemas?.nombre}`);
    } else if (!adminUser.carrera && carreraSistemas) {
      adminUser.carrera = carreraSistemas;
      await this.usersRepository.save(adminUser);
      this.logger.log(`Usuario Administrador actualizado con la carrera ${carreraSistemas.nombre}`);
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }
}
