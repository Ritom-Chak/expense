import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { AuthModule } from '../auth/auth.module';
//import { KpiController } from './kpi.controller';
import {Expense} from "../libs/common/src/entity";
//import { KpiService } from './kpi.service';
//import { kpiProviders } from './kpi.providers';

@Module({
    imports: [TypeOrmModule.forFeature([Expense])],
    //controllers: [KpiController],
    //providers: [KpiService, ...kpiProviders],
})
export class ExpenseModule {}
