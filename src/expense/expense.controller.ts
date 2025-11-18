import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Query,
    ValidationPipe,
    Put,
} from '@nestjs/common';
import {ExpenseService} from "./expense.service";
import {
    CreateExpenseDto,
    DeleteExpenseDto,
    Expense,
    GetExpenseDto,
    GetExpensesDto,
    UpdateExpenseDto,
} from "../libs/common/src"
import {JwtPayload} from "jsonwebtoken";
import {GetUser} from "../libs/common/src/decorator";
import { PinoLogger } from 'nestjs-pino';

@Controller('expenses')
export class ExpenseController {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(ExpenseController.name);
    }

    @Get()
    async getExpenses(
        @Query(new ValidationPipe({ transform: true }))
        getExpensesDto: GetExpensesDto,
    ): Promise<Expense[]> {
        this.logger.info('Fetching the expenses.');
        return this.expenseService.getExpenses(getExpensesDto);
    }

    @Get('/one')
    async getExpenseById(
        @Query(new ValidationPipe({ transform: true }))
        getExpenseDto: GetExpenseDto,
    ): Promise<Expense> {
        this.logger.info('Fetching the expense by id.');
        return this.expenseService.getExpenseById(getExpenseDto);
    }

    @Post()
    async createExpense(
        @Body() createExpenseDto: CreateExpenseDto,
    ): Promise<Expense> {
        return this.expenseService.createExpense(createExpenseDto, null);
    }

    @Put()
    async updateExpense(
        @Body() updateExpenseDto: UpdateExpenseDto,
        @GetUser() user: JwtPayload,
    ): Promise<Expense> {
        this.logger.info('Updating the expense.');
        return this.expenseService.updateExpense(updateExpenseDto, user);
    }

    @Delete()
    async deleteExpense(
        @Query(new ValidationPipe({ transform: true }))
        deleteExpenseDto: DeleteExpenseDto,
    ): Promise<void> {
        this.logger.info('Deleting the expense.');
        return this.expenseService.deleteExpense(deleteExpenseDto);
    }
}
