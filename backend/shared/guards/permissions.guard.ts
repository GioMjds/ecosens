import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * Public decorator and key. Use `@Public()` on controllers or handlers
 * to skip authentication/authorization.
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) Reflect.defineMetadata(IS_PUBLIC_KEY, true, descriptor.value);
    else Reflect.defineMetadata(IS_PUBLIC_KEY, true, target);
    return descriptor || target;
};

/**
 * PermissionsGuard enforces authentication per route prefix.
 * - `/api/admin/*` requires `admin_access` cookie (or valid Bearer header) and admin role
 * - `/api/staff/*` requires `staff_access` cookie (or valid Bearer header) and staff role
 * - `/api/resident/*` requires `resident_access` or `access_token` cookie (or Bearer) and resident role
 * - Routes marked `@Public()` are allowed.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
    private readonly log = new Logger(PermissionGuard.name);
    private readonly globalPrefix = 'api';

    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            this.log.debug('Route marked public — allowing access');
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const url: string = req.originalUrl || req.url || req.path || '';
        this.log.debug(`Checking route: ${url}`);

        const pathSegments = url.split('?')[0].split('/').filter(Boolean);
        let relevant = pathSegments;
        if (pathSegments[0]?.toLowerCase() === this.globalPrefix.toLowerCase()) relevant = pathSegments.slice(1);
        const first = relevant[0]?.toLowerCase() || '';

        if (first === 'admin') return this.validateAdminAccess(req);
        if (first === 'staff') return this.validateStaffAccess(req);
        if (first === 'resident' || first === 'customer') return this.validateResidentAccess(req);

        // non-protected route
        return true;
    }

    private validateAdminAccess(req: any): boolean {
        const token = this.extractToken(req, 'admin_access');
        this.log.debug(`Admin token present: ${!!token}`);
        if (!token) throw new UnauthorizedException('Admin authentication required');

        try {
            const payload: any = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            this.log.debug(`Admin token payload: ${JSON.stringify(payload)}`);

            const role = (payload.role || payload.type || '').toString().toLowerCase();
            if (role !== 'admin') throw new UnauthorizedException('Insufficient permissions');

            req.user = payload;
            return true;
        } catch (err: any) {
            this.log.error(`Admin token verification failed: ${err?.message ?? err}`);
            throw new UnauthorizedException('Invalid or expired admin token');
        }
    }

    private validateStaffAccess(req: any): boolean {
        const token = this.extractToken(req, 'staff_access');
        this.log.debug(`Staff token present: ${!!token}`);
        if (!token) throw new UnauthorizedException('Staff authentication required');

        try {
            const payload: any = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            this.log.debug(`Staff token payload: ${JSON.stringify(payload)}`);

            const role = (payload.role || payload.type || '').toString().toLowerCase();
            if (role !== 'staff') throw new UnauthorizedException('Insufficient permissions');

            req.user = payload;
            return true;
        } catch (err: any) {
            this.log.error(`Staff token verification failed: ${err?.message ?? err}`);
            throw new UnauthorizedException('Invalid or expired staff token');
        }
    }

    private validateResidentAccess(req: any): boolean {
        const token = this.extractToken(req, 'resident_access', 'access_token', 'access');
        this.log.debug(`Resident token present: ${!!token}`);
        if (!token) throw new UnauthorizedException('Resident authentication required');

        try {
            const payload: any = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            this.log.debug(`Resident token payload: ${JSON.stringify(payload)}`);

            const role = (payload.role || payload.type || '').toString().toLowerCase();
            if (role && role !== 'resident') throw new UnauthorizedException('Insufficient permissions');

            req.user = payload;
            return true;
        } catch (err: any) {
            this.log.error(`Resident token verification failed: ${err?.message ?? err}`);
            throw new UnauthorizedException('Invalid or expired resident token');
        }
    }

    private extractToken(req: any, ...cookieNames: string[]): string | null {
        const authHeader = req.headers?.authorization;
        if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            this.log.debug('Token extracted from Bearer header');
            return authHeader.substring(7);
        }

        if (req.cookies) {
            for (const cn of cookieNames) {
                const token = req.cookies[cn];
                if (typeof token === 'string' && token.length) {
                    this.log.debug(`Token extracted from cookie: ${cn}`);
                    return token;
                }
            }
        }

        this.log.debug('No token found in request');
        return null;
    }
}