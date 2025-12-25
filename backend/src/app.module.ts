import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '../shared/modules/prisma.module';
import { CloudinaryModule } from '../shared/modules/cloudinary.module';
import { ResidentModule } from './resident/resident.module';
import { StaffModule } from './staff/staff.module';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { RoleThrottlerGuard } from '../shared/guards/role-throttler.guard';

const TTL = 60;
const LIMIT = 10;

@Module({
	imports: [
		PrismaModule,
		CloudinaryModule,
		ResidentModule,
		StaffModule,
		AdminModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '7d' },
			global: true,
		}),
		ThrottlerModule.forRoot({
			throttlers: [
				{ ttl: TTL, limit: LIMIT },
			]
		}),
	],
	providers: [
		{ provide: APP_GUARD, useClass: RoleThrottlerGuard },
	],
})
export class AppModule {}
