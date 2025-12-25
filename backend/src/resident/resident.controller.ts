import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../../shared/services/auth.service';
import type { Response } from 'express';
import { AuthLoginDto } from '../../shared/dto/auth.dto';

@Controller('resident')
export class ResidentController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: AuthLoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.loginAsResident(dto);

        res.cookie('access_token', result.access_token, {
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
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return { message: 'Logout successful' };
    }
}
