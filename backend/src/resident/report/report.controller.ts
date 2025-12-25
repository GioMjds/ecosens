import { Controller } from '@nestjs/common';
import { ReportsService } from '../../../shared/services/reports.service';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportsService) {}

    
}
