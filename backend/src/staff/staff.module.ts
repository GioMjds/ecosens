import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from '../../shared/modules/auth.module';
import { StaffController } from './staff.controller';
import { ReportsModule } from '../../shared/modules/reports.module';

@Module({
	imports: [
		AuthModule,
		ReportsModule,
		RouterModule.register([
            { path: 'staff', module: StaffModule }
        ]),
	],
	controllers: [StaffController],
})
export class StaffModule {}
