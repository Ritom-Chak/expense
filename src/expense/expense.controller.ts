import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Query,
    UseGuards,
    ValidationPipe,
    Put, Req, BadRequestException,
} from '@nestjs/common';
import { ExpenseService } from "./expense.service";
import {AiService} from "../ai/ai.service";
import {
    CreateExpenseDto,
    DeleteExpenseDto,
    Expense,
    GetExpenseDto,
    GetExpensesDto,
    UpdateExpenseDto,
} from "../libs/common/src"
import { PinoLogger } from 'nestjs-pino';
import { AuthGuard } from "@nestjs/passport";

@Controller('expenses')
@UseGuards(AuthGuard('jwt'))
export class ExpenseController {
    constructor(
        private readonly aiService: AiService,
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
        @Body() dto: UpdateExpenseDto,
        @Query('aiSuggest') aiSuggest: string,
        @Req() req,
    ) {
        const suggest = aiSuggest === 'true';
        return this.expenseService.updateExpense(dto, req.user, suggest);
    }

    @Post('ai-parse')
    async parseExpense(@Body('text') text: string) {
        if (!text) {
            throw new BadRequestException("Text is required");
        }

        const parsed = await this.aiService.parseExpense(text);

        return { parsed };
    }

    @Post('ai-create')
    async aiCreate(@Body('text') text: string) {
        if (!text) {
            throw new BadRequestException("Text is required");
        }

        const parsed = await this.aiService.parseExpense(text);

        return this.expenseService.aiCreateExpense(parsed);
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
