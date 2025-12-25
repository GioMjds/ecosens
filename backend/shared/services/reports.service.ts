import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
    ChangeReportStatusDto,
	ReportFileDto,
	ReportQueryDto,
	SubmitReportDto,
	UpdateReportDto,
} from '../dto/reports.dto';

// Reports CRUD operations
@Injectable()
export class ReportsService {
	private readonly log = new Logger(ReportsService.name);
	constructor(private readonly prisma: PrismaService) {}

	// Admin-side: Get all reports
	async getAllReports() {
		try {
			const reports = await this.prisma.report.findMany({
				include: { files: true, reporter: true },
			});
			this.log.log(`Fetched all reports`);
			return reports;
		} catch (error) {
			this.log.error(
				`Error fetching reports: ${error?.message ?? error}`
			);
			throw new BadRequestException('Failed to fetch reports');
		}
	}

	// Admin-side, staff-side, and resident-side: Get report by ID
	async getReportById(reportId: string) {
		try {
			const report = await this.prisma.report.findUnique({
				where: { id: reportId },
				include: { files: true, reporter: true },
			});
			this.log.log(`Fetched report with ID: ${reportId}`);
			this.log.debug(`Report details: ${JSON.stringify(report)}`);
			return report;
		} catch (error) {
			this.log.error(
				`Error fetching report by ID: ${error?.message ?? error}`
			);
			throw new BadRequestException('Failed to fetch report');
		}
	}

	// Resident-side: Submit a new report
	async submitReport(dto: SubmitReportDto, reporterId?: string) {
		try {
			const data: any = {
				title: dto.title,
				description: dto.description,
				isAnonymous: !!dto.isAnonymous,
				reporterId: dto.reporterId ?? reporterId ?? null,
			};

			const created = await this.prisma.report.create({
				data: {
					...data,
					files: dto.files
						? {
								create: dto.files.map((f: ReportFileDto) => ({
									fileUrl: f.fileUrl,
									fileType: f.fileType,
									mimeType: f.mimeType,
									filePath: f.filePath,
								})),
							}
						: undefined,
				},
				include: { files: true, reporter: true },
			});

			this.log.log(`Report created: ${created.id}`);
			return created;
		} catch (error) {
			this.log.error(`Error submitting report: ${error?.message}`);
			throw new BadRequestException('Failed to submit report');
		}
	}

	// Admin/staff-side, or even resident-side: Update report
	async updateReport(reportId: string, dto: UpdateReportDto) {
		try {
			const updateData = {};
			if (dto.title !== undefined) updateData['title'] = dto.title;
			if (dto.description !== undefined) updateData['description'] = dto.description;
			if (dto.status !== undefined) updateData['status'] = dto.status;

			const updated = await this.prisma.report.update({
				where: { id: reportId },
				data: {
					...updateData,
					files:
						dto.files && dto.files.length
							? {
									create: dto.files.map(
										(f: ReportFileDto) => ({
											fileUrl: f.fileUrl,
											fileType: f.fileType,
											mimeType: f.mimeType,
											filePath: f.filePath,
										})
									),
								}
							: undefined,
				},
				include: { files: true, reporter: true },
			});
			this.log.log(`Report updated: ${reportId}`);
			return updated;
		} catch (error) {
			this.log.error(`Error updating report: ${error?.message}`);
			throw new BadRequestException('Failed to update report');
		}
	}

    // Admin/staff-side: Change report status
    async changeReportStatus(reportId: string, dto: ChangeReportStatusDto) {
        const { status, note } = dto;
        try {
            const updated = await this.prisma.report.update({
                where: { id: reportId },
                data: { status },
                include: { files: true, reporter: true },
            });

            // Notify reporter if not anonymous
            // if (updated.reporterId) {
            //     const message = `Your report "${updated.title}" status changed to ${dto.status}. ${
            //         dto.note ?? ''
            //     }`.trim();
            //     await this.prisma.notification.create({
            //         data: {
            //             userId: updated.reporterId,
            //             message,
            //         },
            //     });
            // }

            this.log.log(`Report status changed: ${reportId} to ${status}`);
            return updated;
        } catch (error) {
            this.log.error(`Error changing report status: ${error?.message}`);
            throw new BadRequestException('Failed to change report status');
        }
    }

    // Admin/staff-side: Soft delete report
    async deleteReport(reportId: string) {
        try {
            const deleted = await this.prisma.report.update({
                where: { id: reportId },
                data: { deletedAt: new Date() }
            });
            this.log.log(`Report soft-deleted: ${reportId}`);
            return deleted;
        } catch (error) {
            this.log.error(`Error deleting report: ${error?.message}`);
            throw new BadRequestException('Failed to delete report');
        }
    }

    // Admin/staff-side: List reports with filters/pagination
    async listReports(query: ReportQueryDto) {
        try {
            const page = query.page ?? 1;
            const limit = query.limit ?? 20;
            const where: any = { deletedAt: null };

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
                    include: { files: true, reporter: true },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy:
                        query.sortBy && query.sortOrder
                            ? { [query.sortBy]: query.sortOrder === 'asc' ? 'asc' : 'desc' }
                            : { createdAt: 'desc' },
                }),
                this.prisma.report.count({ where }),
            ]);

            return { items, total, page, limit };
        } catch (error) {
            this.log.error(`Error listing reports: ${error?.message ?? error}`);
            throw new BadRequestException('Failed to list reports');
        }
    }

    // Files helpers
    async addFileToReport(reportId: string, file: ReportFileDto) {
        try {
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
            throw new BadRequestException('Failed to add file to report');
        }
    }

    async removeFileFromReport(reportId: string, fileId: string) {
        try {
            // Ensure file belongs to report
            await this.prisma.reportFile.deleteMany({
                where: { id: fileId, reportId },
            });
            this.log.log(`Removed file ${fileId} from report ${reportId}`);
            return { success: true };
        } catch (error) {
            this.log.error(`Error removing file from report: ${error?.message ?? error}`);
            throw new BadRequestException('Failed to remove file from report');
        }
    }

    // Staff-side: Get all reports by reporter
    async getReportsByReporter(reporterId: string) {
        try {
            const reports = await this.prisma.report.findMany({
                where: { reporterId, deletedAt: null },
                include: { files: true },
                orderBy: { createdAt: 'desc' },
            });
            return reports;
        } catch (error) {
            this.log.error(`Error fetching reports by reporter: ${error?.message ?? error}`);
            throw new BadRequestException('Failed to fetch reports');
        }
    }
}
