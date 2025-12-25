import { Module } from '@nestjs/common';
import { ReportController } from './report/report.controller';
import { ReportsService } from '../../shared/services/reports.service';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { ResidentController } from './resident.controller';

@Module({
  controllers: [ReportController, ResidentController],
  providers: [ReportsService, NotificationsGateway]
})
export class ResidentModule {}
