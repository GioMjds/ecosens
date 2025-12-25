import {
	Controller,
	Post,
	HttpCode,
	HttpStatus,
	Body,
	Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../../shared/services/auth.service';
import { AuthLoginDto } from '../../shared/dto/auth.dto';

@Controller('admin')
export class AdminController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(
		@Body() dto: AuthLoginDto,
		@Res({ passthrough: true }) res: Response
	) {
		const result = await this.authService.loginAsAdmin(dto);

		res.cookie('admin_access', result.admin_access, {
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		});

		res.cookie('refresh_token', result.refresh_token, {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		});

		return result;
	}

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(
        @Res({ passthrough: true }) res: Response
    ) {
        res.clearCookie('admin_access');
        res.clearCookie('refresh_token');

        return { message: 'Logout successful' };
    }
}
