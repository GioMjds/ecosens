import { Type } from 'class-transformer';
import {
	IsString,
	IsOptional,
	IsBoolean,
	IsEnum,
	IsUUID,
	IsArray,
	ValidateNested,
	IsNumber,
	Min,
	Max,
} from 'class-validator';

export enum ReportStatusDto {
	Submitted = 'Submitted',
	UnderReview = 'UnderReview',
	Verified = 'Verified',
	Resolved = 'Resolved',
	Closed = 'Closed',
}

export class ReportFileDto {
	@IsOptional()
	@IsUUID()
	id?: string;

	@IsString()
	fileUrl!: string;

	@IsString()
	fileType!: string;

	@IsString()
	mimeType!: string;

	@IsString()
	filePath!: string;
}

export class SubmitReportDto {
	@IsString()
	title!: string;

	@IsString()
	description!: string;

	@IsOptional()
	@IsBoolean()
	isAnonymous?: boolean;

	// For multipart uploads the frontend may send file metadata after upload.
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ReportFileDto)
	files?: ReportFileDto[];

	// Optional: admin/staff can set reporterId when creating on behalf of someone
	@IsOptional()
	@IsUUID()
	reporterId?: string;
}

export class UpdateReportDto {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	// Only staff/admin should send status changes through dedicated endpoint,
	// but include here for completeness.
	@IsOptional()
	@IsEnum(ReportStatusDto)
	status?: ReportStatusDto;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ReportFileDto)
	files?: ReportFileDto[];
}

export class ChangeReportStatusDto {
	@IsEnum(ReportStatusDto)
	status!: ReportStatusDto;

	@IsOptional()
	@IsString()
	note?: string;
}

export class AssignReportDto {
	@IsUUID()
	staffId!: string;
}

export class ReportQueryDto {
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	@Min(1)
	page?: number = 1;

	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	@Min(1)
	@Max(100)
	limit?: number = 20;

	@IsOptional()
	@IsEnum(ReportStatusDto)
	status?: ReportStatusDto;

	@IsOptional()
	@IsUUID()
	reporterId?: string;

	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsString()
	sortBy?: string;

	@IsOptional()
	@IsString()
	sortOrder?: 'asc' | 'desc';
}
