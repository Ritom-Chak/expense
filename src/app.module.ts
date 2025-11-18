import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Expense} from "./libs/common/src";
import { ExpenseModule } from './expense/expense.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'mysql',
            port: 3306,
            username: 'root',
            password: '',
            database: 'expensedb',
            entities: [Expense],
            synchronize: false,
        }),

        ExpenseModule,
    ],
})
export class AppModule {}