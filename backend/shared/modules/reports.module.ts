import { Global, Module } from "@nestjs/common";
import { PrismaModule } from "./prisma.module";
import { ReportsService } from "../services/reports.service";
import { ReportsController } from "../controllers/reports.controller";

@Global()
@Module({
    imports: [PrismaModule],
    controllers: [ReportsController],
    providers: [ReportsService],
    exports: [ReportsService],
})
export class ReportsModule {}