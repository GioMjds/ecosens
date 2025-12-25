import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ReportsService } from '../../../shared/services/reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllReports() {
        return this.reportsService.getAllReports();
    }
}
