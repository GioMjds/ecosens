import {
	Injectable,
	ExecutionContext,
	CanActivate,
	UnauthorizedException,
	Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
	private readonly log = new Logger(PermissionGuard.name);
	constructor(
		private readonly jwtService: JwtService,
		private readonly reflector: Reflector
	) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		return false;
	}
}
