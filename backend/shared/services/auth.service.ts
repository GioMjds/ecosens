import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "./prisma.service";
import { AuthLoginDto } from "../dto/auth.dto";
import { compare } from "bcrypt";

@Injectable()
export class AuthService {
    private readonly log = new Logger(AuthService.name);
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async loginAsStaff(dto: AuthLoginDto) {
        const { email, password } = dto;
        try {
            const existingStaff = await this.prisma.user.findFirst({
                where: {
                    email,
                    role: { some: { role: 'Staff' } },
                },
                include: { role: true },
            });

            if (!existingStaff) {
                throw new NotFoundException('Staff does not exist or is not authorized');
            }

            if (!existingStaff.password) {
                throw new BadRequestException('Invalid credentials');
            }

            const passwordMatch = await compare(password, existingStaff.password);

            if (!passwordMatch) {
                throw new BadRequestException('Invalid credentials');
            }

            const payload = {
                sub: existingStaff.id,
                email: existingStaff.email,
                roles: existingStaff.role?.map(r => r.role),
            };

            const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
            const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

            return {
                message: 'Login successful',
                staff_access: accessToken,
                refresh_token: refreshToken,
            };
        } catch (error) {
            this.log.error(`Error logging in as staff: ${error?.message ?? error}`);
            throw new BadRequestException('Login failed');
        }
    };

    async loginAsAdmin(dto: AuthLoginDto) {
        const { email, password } = dto;

        try {
            const existingAdmin = await this.prisma.user.findFirst({
                where: {
                    email,
                    role: { some: { role: 'Admin' } },
                },
                include: { role: true },
            });

            if (!existingAdmin) {
                throw new NotFoundException('Admin does not exist or is not authorized');
            }

            if (!existingAdmin.password) {
                throw new BadRequestException('Invalid credentials');
            }

            const passwordMatch = await compare(password, existingAdmin.password);

            if (!passwordMatch) {
                throw new BadRequestException('Invalid credentials');
            }

            const payload = {
                sub: existingAdmin.id,
                email: existingAdmin.email,
                roles: existingAdmin.role?.map(r => r.role) ?? [],
            };

            const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
            const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

            return {
                message: 'Login successful',
                admin_access: accessToken,
                refresh_token: refreshToken,
            };
        } catch (error) {
            this.log.error(`Error logging in as admin: ${error?.message ?? error}`);
            throw new BadRequestException('Login failed');
        }
    }

    async loginAsResident(dto: AuthLoginDto) {
        const { email, password } = dto;
        try {
            const resident = await this.prisma.user.findFirst({
                where: {
                    email,
                    role: { some: { role: 'Resident' } },
                },
                include: { role: true },
            });

            if (!resident) {
                throw new NotFoundException('Resident does not exist');
            }

            if (!resident.password) {
                throw new BadRequestException('Invalid credentials');
            }

            const passwordMatch = await compare(password, resident.password);

            if (!passwordMatch) {
                throw new BadRequestException('Invalid credentials');
            }

            const payload = {
                sub: resident.id,
                email: resident.email,
                roles: resident.role?.map(r => r.role) ?? [],
            };

            const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
            const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

            return {
                message: 'Login successful',
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        } catch (error) {
            this.log.error(`Error logging in as resident: ${error?.message ?? error}`);
            throw new BadRequestException('Login failed');
        }
    }
}