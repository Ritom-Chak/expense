import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../libs/common/src';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { ExpenseProviders } from '../libs/common/src/providers/expense.provider';
import { LoggerModule } from 'nestjs-pino';

@Module({
    imports: [
        TypeOrmModule.forFeature([Expense]),],
    controllers: [ExpenseController],
    providers: [
        ExpenseService,
        //...ExpenseProviders,
    ],
})
export class ExpenseModule {}