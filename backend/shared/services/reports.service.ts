import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
    ChangeReportStatusDto,
    ReportFileDto,
    ReportQueryDto,
    SubmitReportDto,
    UpdateReportDto,
} from '../dto/reports.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
    private readonly log = new Logger(ReportsService.name);
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Get all reports (Admin/Staff view)
     * Excludes soft-deleted reports
     */
    async getAllReports() {
        try {
            const reports = await this.prisma.report.findMany({
                where: { deletedAt: null },
                include: { 
                    files: true, 
                    reporter: {
                        select: {
                            id: true,
                            fullname: true,
                            email: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
            });
            this.log.log(`Fetched ${reports.length} reports`);
            return reports;
        } catch (error) {
            this.log.error(`Error fetching reports: ${error?.message ?? error}`);
            throw new BadRequestException('Failed to fetch reports');
        }
    }

    /**
     * Get report by ID
     * Returns null if not found
     */
    async getReportById(reportId: string) {
        try {
            const report = await this.prisma.report.findFirst({
                where: { 
                    id: reportId,
                    deletedAt: null 
                },
                include: { 
                    files: true, 
                    reporter: {
                        select: {
                            id: true,
                            fullname: true,
                            email: true,
                        }
                    }
                },
            });

            if (report) {
                this.log.log(`Fetched report with ID: ${reportId}`);
            }
            
            return report;
        } catch (error) {
            this.log.error(`Error fetching report by ID: ${error?.message ?? error}`);
            throw new BadRequestException('Failed to fetch report');
        }
    }

    /**
     * Submit a new report
     * @param dto Report data
     * @param reporterId User ID of the reporter (from authentication)
     */
    async submitReport(dto: SubmitReportDto, reporterId?: string) {
        try {
            // Validate: if not anonymous, must have a reporterId
            if (!dto.isAnonymous && !reporterId) {
                throw new BadRequestException('Non-anonymous reports must have a reporter');
            }

            const data: Prisma.ReportCreateInput = {
                title: dto.title,
                description: dto.description,
                isAnonymous: !!dto.isAnonymous,
                reporter: reporterId && !dto.isAnonymous
                    ? { connect: { id: reporterId } }
                    : undefined,
                files: dto.files?.length
                    ? {
                        create: dto.files.map((f: ReportFileDto) => ({
                            fileUrl: f.fileUrl,
                            fileType: f.fileType,
                            mimeType: f.mimeType,
                            filePath: f.filePath,
                        })),
                    }
                    : undefined,
            };

            const created = await this.prisma.report.create({
                data,
                include: { files: true, reporter: true },
            });

            this.log.log(`Report created: ${created.id} (Anonymous: ${created.isAnonymous})`);
            return created;
        } catch (error) {
            this.log.error(`Error submitting report: ${error?.message}`);
            throw error instanceof BadRequestException 
                ? error 
                : new BadRequestException('Failed to submit report');
        }
    }

    /**
     * Update report
     * @param reportId Report ID
     * @param dto Update data
     */
    async updateReport(reportId: string, dto: UpdateReportDto) {
        try {
            // Check if report exists and is not deleted
            const existing = await this.getReportById(reportId);
            if (!existing) {
                throw new NotFoundException('Report not found');
            }

            const updateData: Prisma.ReportUpdateInput = {};
            
            if (dto.title !== undefined) updateData.title = dto.title;
            if (dto.description !== undefined) updateData.description = dto.description;
            if (dto.status !== undefined) updateData.status = dto.status;

            // Handle file additions
            if (dto.files?.length) {
                updateData.files = {
                    create: dto.files.map((f: ReportFileDto) => ({
                        fileUrl: f.fileUrl,
                        fileType: f.fileType,
                        mimeType: f.mimeType,
                        filePath: f.filePath,
                    })),
                };
            }

            const updated = await this.prisma.report.update({
                where: { id: reportId },
                data: updateData,
                include: { files: true, reporter: true },
            });

            this.log.log(`Report updated: ${reportId}`);
            return updated;
        } catch (error) {
            this.log.error(`Error updating report: ${error?.message}`);
            throw error instanceof NotFoundException 
                ? error 
                : new BadRequestException('Failed to update report');
        }
    }

    /**
     * Change report status (Admin/Staff only)
     * @param reportId Report ID
     * @param dto Status change data
     */
    async changeReportStatus(reportId: string, dto: ChangeReportStatusDto) {
        const { status, note } = dto;
        try {
            const existing = await this.getReportById(reportId);
            if (!existing) {
                throw new NotFoundException('Report not found');
            }

            const updated = await this.prisma.report.update({
                where: { id: reportId },
                data: { status },
                include: { files: true, reporter: true },
            });

            // Create notification for non-anonymous reports
            if (updated.reporterId) {
                const message = `Your report "${updated.title}" status changed to ${status}.${
                    note ? ` Note: ${note}` : ''
                }`;
                
                await this.prisma.notification.create({
                    data: {
                        userId: updated.reporterId,
                        message,
                    },
                });
                
                this.log.log(`Notification sent to user ${updated.reporterId}`);
            }

            this.log.log(`Report status changed: ${reportId} to ${status}`);
            return updated;
        } catch (error) {
            this.log.error(`Error changing report status: ${error?.message}`);
            throw error instanceof NotFoundException 
                ? error 
                : new BadRequestException('Failed to change report status');
        }
    }

    /**
     * Soft delete a report
     * @param reportId Report ID
     */
    async deleteReport(reportId: string) {
        try {
            const existing = await this.getReportById(reportId);
            if (!existing) {
                throw new NotFoundException('Report not found');
            }

            const deleted = await this.prisma.report.update({
                where: { id: reportId },
                data: { deletedAt: new Date() },
            });

            this.log.log(`Report soft-deleted: ${reportId}`);
            return deleted;
        } catch (error) {
            this.log.error(`Error deleting report: ${error?.message}`);
            throw error instanceof NotFoundException 
                ? error 
                : new BadRequestException('Failed to delete report');
        }
    }

    /**
     * List reports with filters and pagination
     * @param query Query parameters
     */
    async listReports(query: ReportQueryDto) {
        try {
            const page = query.page ?? 1;
            const limit = query.limit ?? 20;
            const where: Prisma.ReportWhereInput = { deletedAt: null };

            if (query.status) where.status = query.status as any;
            if (query.reporterId) where.reporterId = query.reporterId;
            if (query.search) {
                where.OR = [
                    { title: { contains: query.search, mode: 'insensitive' } },
                    { description: { contains: query.search, mode: 'insensitive' } },
                ];
            }

            const [items, total] = await Promise.all([
                this.prisma.report.findMany({
                    where,
                    include: { 
                        files: true, 
                        reporter: {
                            select: {
                                id: true,
                                fullname: true,
                                email: true,
                            }
                        }
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: query.sortBy && query.sortOrder
                        ? { [query.sortBy]: query.sortOrder === 'asc' ? 'asc' : 'desc' }
                        : { createdAt: 'desc' },
                }),
                this.prisma.report.count({ where }),
            ]);

            return { 
                items, 
                total, 
                page, 
                limit,
                totalPages: Math.ceil(total / limit) 
            };
        } catch (error) {
            this.log.error(`Error listing reports: ${error?.message ?? error}`);
            throw new BadRequestException('Failed to list reports');
        }
    }

    /**
     * Add a file to a report
     */
    async addFileToReport(reportId: string, file: ReportFileDto) {
        try {
            const report = await this.getReportById(reportId);
            if (!report) {
                throw new NotFoundException('Report not found');
            }

            const created = await this.prisma.reportFile.create({
                data: {
                    reportId,
                    fileUrl: file.fileUrl,
                    fileType: file.fileType,
                    mimeType: file.mimeType,
                    filePath: file.filePath,
                },
            });

            this.log.log(`Added file ${created.id} to report ${reportId}`);
            return created;
        } catch (error) {
            this.log.error(`Error adding file to report: ${error?.message ?? error}`);
            throw error instanceof NotFoundException 
                ? error 
                : new BadRequestException('Failed to add file to report');
        }
    }

    /**
     * Remove a file from a report
     */
    async removeFileFromReport(reportId: string, fileId: string) {
        try {
            const result = await this.prisma.reportFile.deleteMany({
                where: { id: fileId, reportId },
            });

            if (result.count === 0) {
                throw new NotFoundException('File not found or does not belong to this report');
            }

            this.log.log(`Removed file ${fileId} from report ${reportId}`);
            return { success: true };
        } catch (error) {
            this.log.error(`Error removing file from report: ${error?.message ?? error}`);
            throw error instanceof NotFoundException 
                ? error 
                : new BadRequestException('Failed to remove file from report');
        }
    }

    /**
     * Get all reports by a specific reporter
     * @param reporterId User ID
     */
    async getReportsByReporter(reporterId: string) {
        try {
            const reports = await this.prisma.report.findMany({
                where: { 
                    reporterId, 
                    deletedAt: null 
                },
                include: { files: true },
                orderBy: { createdAt: 'desc' },
            });

            this.log.log(`Fetched ${reports.length} reports for reporter ${reporterId}`);
            return reports;
        } catch (error) {
            this.log.error(`Error fetching reports by reporter: ${error?.message ?? error}`);
            throw new BadRequestException('Failed to fetch reports');
        }
    }
}