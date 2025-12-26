import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from '../../shared/modules/auth.module';
import { AdminController } from './admin.controller';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { ReportsModule } from '../../shared/modules/reports.module';

@Module({
	imports: [
		AuthModule,
		ReportsModule,
		RouterModule.register([
			{ path: 'admin', module: AdminModule },
		]),
	],
	controllers: [AdminController, UsersController],
	providers: [UsersService],
})
export class AdminModule {}
