import { Module } from '@nestjs/common';
import { AuthModule } from '../../shared/modules/auth.module';
import { AdminController } from './admin.controller';
import { ReportsController } from './reports/reports.controller';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { ReportsModule } from '../../shared/modules/reports.module';

@Module({
    imports: [AuthModule, ReportsModule],
    controllers: [AdminController, ReportsController, UsersController],
    providers: [UsersService],
})
export class AdminModule {}
