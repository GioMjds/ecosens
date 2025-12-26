import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { PermissionGuard } from '../../../shared/guards/permissions.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { ReportsService } from '../../../shared/services/reports.service';
import { ChangeReportStatusDto } from '../../../shared/dto/reports.dto';

@UseGuards(PermissionGuard)
@Roles('Staff')
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllReports() {
        return this.reportsService.getAllReports();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getReportById(@Param('id') id: string) {
        const report = await this.reportsService.getReportById(id);
        if (!report) throw new NotFoundException('Report not found');
        return report;
    }

    @Put(':id/verify')
    @HttpCode(HttpStatus.OK)
    async verifyReport(
        @Param('id') id: string,
        @Body() dto: ChangeReportStatusDto
    ) {
        return this.reportsService.changeReportStatus(id, dto);
    }

    @Put(':id/resolve')
    @HttpCode(HttpStatus.OK)
    async resolveReport(
        @Param('id') id: string,
        @Body() dto: ChangeReportStatusDto
    ) {
        return this.reportsService.changeReportStatus(id, dto);
    }

    @Put(':id/close')
    @HttpCode(HttpStatus.OK)
    async closeReport(
        @Param('id') id: string,
        @Body() dto: ChangeReportStatusDto
    ) {
        return this.reportsService.changeReportStatus(id, dto);
    }
}
