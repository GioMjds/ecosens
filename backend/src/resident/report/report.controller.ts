import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Body,
    Req,
    Get,
    Param,
    Patch,
    ForbiddenException,
    NotFoundException,
    Delete,
    BadRequestException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ReportsService } from '../../../shared/services/reports.service';
import {
    SubmitReportDto,
    UpdateReportDto,
} from '../../../shared/dto/reports.dto';
import type { Request } from 'express';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportsService) {}

    // Allow residents to submit up to 5 reports per minute
    @Throttle({ default: { limit: 5, ttl: 60 } })
    @Post('submit')
    @HttpCode(HttpStatus.CREATED)
    async submitReport(
        @Body() dto: SubmitReportDto,
        @Req() req: Request
    ) {
        const userId = this.extractUserId(req);

        // If not anonymous, ensure reporterId matches authenticated user
        if (!dto.isAnonymous && dto.reporterId && dto.reporterId !== userId) {
            throw new ForbiddenException('Reporter ID does not match authenticated user');
        }

        return this.reportService.submitReport(dto, userId);
    }

    // List reports for the authenticated resident (their own reports)
    @Throttle({ default: { limit: 20, ttl: 60 } })
    @Get()
    async getMyReports(
        @Req() req: Request
    ) {
        const userId = this.extractUserId(req);
        return this.reportService.getReportsByReporter(userId);
    }

    // Get a single report (resident view). Anonymous reports hide reporter info.
    @Throttle({ default: { limit: 20, ttl: 60 } })
    @Get(':id')
    async getReport(
        @Param('id') id: string,
        @Req() req: Request
    ) {
        const userId = this.extractUserId(req);
        const report = await this.reportService.getReportById(id);

        if (!report) {
            throw new ForbiddenException('Report not found');
        }

        const isOwner = report.reporterId === userId;

        if (!isOwner) {
            throw new ForbiddenException('Access denied to this report');
        }

        // If anonymous, remove reporter info even from the owner's view
        // (or adjust this logic as per requirements)
        if (report.isAnonymous) {
            const { reporter, ...sanitizedReport } = report;
            return sanitizedReport;
        }

        return report;
    }

    // Allow residents to update their own report (limited)
    @Throttle({ default: { limit: 5, ttl: 60 } })
    @Patch(':id')
    async updateReport(
        @Param('id') id: string, 
        @Body() dto: UpdateReportDto, 
        @Req() req: Request
    ) {
        const userId = this.extractUserId(req);
        const report = await this.reportService.getReportById(id);

        if (!report) {
            throw new NotFoundException('Report not found');
        }

        if (report.reporterId !== userId) {
            throw new ForbiddenException('You can only update your own reports');
        }

        if (dto.status !== undefined) {
            throw new ForbiddenException('Residents cannot update report status');
        }

        if (['Resolved', 'Closed'].includes(report.status)) {
            throw new ForbiddenException('Cannot update a resolved or closed report');
        }

        return this.reportService.updateReport(id, dto);
    }

    @Throttle({ default: { limit: 100, ttl: 60 } })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteReport(
        @Param('id') id: string,
        @Req() req: Request
    ) {
        const userId = this.extractUserId(req);
        const report = await this.reportService.getReportById(id);

        if (!report) {
            throw new NotFoundException('Report not found');
        }

        if (report.reporterId !== userId) {
            throw new ForbiddenException('You can only delete your own reports');
        }

        if (report.status !== 'Submitted') {
            throw new BadRequestException('Only reports with status Submitted can be deleted');
        }

        return this.reportService.deleteReport(id);
    }

    private extractUserId(req: Request): string {
        const userId = (req as any).user?.sub ?? (req as any).user?.id;
        if (!userId) {
            throw new ForbiddenException('Authentication required');
        }
        return userId;
    }
}
