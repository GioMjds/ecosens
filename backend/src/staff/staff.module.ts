import { Module } from '@nestjs/common';
import { AuthModule } from '../../shared/modules/auth.module';
import { StaffController } from './staff.controller';
import { ReportsController } from './reports/reports.controller';
import { ReportsModule } from '../../shared/modules/reports.module';

@Module({
    imports: [AuthModule, ReportsModule],
    controllers: [StaffController, ReportsController],
})
export class StaffModule {}
