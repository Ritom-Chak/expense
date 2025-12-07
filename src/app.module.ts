import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import {AuthModule} from "./auth/auth.module";
import {AiModule} from "./ai/ai.module";
import {Expense, User} from './libs/common/src';
import { ExpenseModule } from './expense/expense.module';

@Module({
    imports: [
        AuthModule,
        AiModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
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
            entities: [Expense, User],
            synchronize: true,
        }),

        ExpenseModule,
    ],
})
export class AppModule {}