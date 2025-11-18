import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { Expense } from './libs/common/src';
import { ExpenseModule } from './expense/expense.module';

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                level: 'debug',
            },
        }),

        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'mysql',
            port: 3306,
            username: 'root',
            password: '',
            database: 'expensedb',
            entities: [Expense],
            synchronize: true,
        }),

        ExpenseModule,
    ],
})
export class AppModule {}