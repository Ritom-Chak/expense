import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Expense} from '../libs/common/src';
import {ExpenseController} from './expense.controller';
import {ExpenseService} from './expense.service';
import {AiModule} from "../ai/ai.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Expense]),AiModule],
    controllers: [ExpenseController],
    providers: [
        ExpenseService,
    ],
})
export class ExpenseModule {
}