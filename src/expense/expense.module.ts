import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Expense} from "../libs/common/src";

@Module({
    imports: [TypeOrmModule.forFeature([Expense])],
})
export class ExpenseModule {}
