import { Global, Module } from "@nestjs/common";
import { PrismaModule } from "./prisma.module";
import { ReportsService } from "../services/reports.service";

@Global()
@Module({
    imports: [PrismaModule],
    providers: [ReportsService],
    exports: [ReportsService],
})
export class ReportsModule {}