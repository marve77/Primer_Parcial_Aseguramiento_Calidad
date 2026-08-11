import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
// Asegúrate de crear este archivo en decorators/roles.decorator.ts
// export const ROLES_KEY = 'roles';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      // 1. Validar el token y obtener el payload (RNF07)
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'super-secret-key',
      });

      // 2. Validación de correo institucional (RF01)
      const allowedDomain = '@miumg.edu.gt';
      if (!payload.email || !payload.email.endsWith(allowedDomain)) {
        throw new ForbiddenException(
          `Acceso denegado: Se requiere un correo institucional (${allowedDomain})`,
        );
      }

      // Asignar el payload al objeto request para su uso posterior en los controladores
      request['user'] = payload;

      // 3. Validación de Roles (RF02)
      // Se busca la metadata de los roles definidos en el controlador/endpoint
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      // Si el endpoint no especifica roles, se permite el acceso al usuario validado
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      // Verificamos si el rol del payload (ej. "Administrador" o "Estudiante") está permitido
      const hasRole = requiredRoles.includes(payload.role);
      if (!hasRole) {
        throw new ForbiddenException('No tienes permisos suficientes para esta acción');
      }

    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error; // Mantenemos el error de Forbidden intacto
      }
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
