import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma.module";
import { AuthService } from "../services/auth.service";
import { Reflector } from "@nestjs/core";

@Module({
    imports: [PrismaModule],
    providers: [AuthService, Reflector],
    exports: [AuthService],
})
export class AuthModule {}