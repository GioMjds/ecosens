import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';

@Injectable()
export class RoleThrottlerGuard extends ThrottlerGuard {
	// use user id when authenticated to avoid per-IP collisions
	protected generateKey(context: ExecutionContext): string {
		const req = context.switchToHttp().getRequest();
		const userId = req.user?.sub ?? req.user?.id;
		if (userId) return `user-${userId}`;

		// fallback to client IP (avoid calling super.generateKey which expects different args)
		const ip =
			req.ip ??
			(req.ips && req.ips.length ? req.ips[0] : undefined) ??
			req.connection?.remoteAddress ??
			(req.headers && (req.headers['x-forwarded-for'] as string)?.split(',')[0]) ??
			'unknown';
		return `ip-${ip}`;
	}

	// adjust limit per role
	protected async handleRequest(requestProps: ThrottlerRequest) {
		const { context, limit, ttl } = requestProps;
		const req = context.switchToHttp().getRequest();
		const roles: string[] = req.user?.roles ?? [];

		let customLimit = limit;
		if (roles.includes('Admin'))
			customLimit = Math.max(limit * 10, 1000); // very permissive
		else if (roles.includes('Staff'))
			customLimit = Math.max(limit * 2, 200);
		else customLimit = limit; // Resident / anonymous

		// call super with the modified limit
		return super.handleRequest({ ...requestProps, limit: customLimit, ttl });
	}
}
