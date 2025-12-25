import { Module } from '@nestjs/common';
import { AuthModule } from '../../shared/modules/auth.module';
import { StaffController } from './staff.controller';

@Module({
    imports: [AuthModule],
    controllers: [StaffController],
})
export class StaffModule {}
