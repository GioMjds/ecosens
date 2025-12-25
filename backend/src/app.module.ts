import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/modules/prisma.module';
import { CloudinaryModule } from '../shared/modules/cloudinary.module';
import { ResidentModule } from './resident/resident.module';
import { StaffModule } from './staff/staff.module';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';

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
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
