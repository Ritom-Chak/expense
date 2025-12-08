import {Injectable, NotFoundException} from '@nestjs/common';
import {
    Expense,
    CreateExpenseDto,
    DeleteExpenseDto,
    GetExpensesDto,
    GetExpenseDto,
    UpdateExpenseDto,
    SortOrder
} from "../libs/common/src";
import {MoreThan, Repository} from 'typeorm';
import {JwtPayload} from "jsonwebtoken";
import {PinoLogger} from 'nestjs-pino';
import {AiService} from "../ai/ai.service";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense)
        private readonly expenseRepository: Repository<Expense>,
        private readonly aiService: AiService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(ExpenseService.name);
    }

    async getExpenses(getExpensesDto: GetExpensesDto): Promise<any> {
        const {search} = getExpensesDto;
        const query = this.expenseRepository.createQueryBuilder('expense');

        if (getExpensesDto.search) {
            query.andWhere(
                '(LOWER(expense.title) LIKE LOWER(:search)  OR expense.id like :search)',
                {search: `%${search}%`},
            );
        }

        let skip = 0;

        if (
            getExpensesDto.pageSize === 0 ||
            getExpensesDto.pageSize === undefined
        ) {
            getExpensesDto.pageSize = 10;
        }
        if (getExpensesDto.page > 0) {
            getExpensesDto.page = getExpensesDto.page - 1;
            skip = getExpensesDto.page * getExpensesDto.pageSize;
        }

        if (getExpensesDto.field) {
            if (getExpensesDto.dir.toLowerCase() === 'asc') {
                query.orderBy(getExpensesDto.field, SortOrder.ASC);
            } else if (getExpensesDto.dir.toLowerCase() === 'desc') {
                query.orderBy(getExpensesDto.field, SortOrder.DESC);
            }
        } else {
            query.orderBy('expense.id', SortOrder.DESC);
        }

        try {
            const [expenses, filterCount] = await query
                .take(getExpensesDto.pageSize)
                .skip(skip)
                .getManyAndCount();

            const queryCount =
                this.expenseRepository.createQueryBuilder('expense');
            const totalCount = await queryCount.getCount();

            this.logger.info('Fetched expenses.');
            return {expenses, filterCount, totalCount};
        } catch (error) {
            this.logger.error('Failed to get the expenses.', error.stack);
            throw new NotFoundException();
        }
    }

    async getExpenseById(getExpenseDto: GetExpenseDto): Promise<any> {
        const {id} = getExpenseDto;
        const query = this.expenseRepository
            .createQueryBuilder('expense')
            .where({id: id});

        try {
            const expense = await query.getOne();

            if (!expense) {
                throw new NotFoundException(`Expense with ID "${id}" not found`);
            }
            this.logger.info(`Fetched expense with id: ${id}`);

            return {expense};
        } catch (error) {
            this.logger.error(`Failed to get expense with id: ${id}`, error.stack);
            throw new NotFoundException();
        }
    }

    async fetchExpense(id: number): Promise<Expense> {
        const query = this.expenseRepository
            .createQueryBuilder('expense')
            .where({id: id});

        try {
            const expense = await query.getOne();

            if (!expense) {
                throw new NotFoundException(`expense with ID "${id}" not found`);
            }
            this.logger.info(`Fetched expense with id: ${id}`);

            return expense;
        } catch (error) {
            this.logger.error(`Failed to get expense with id: ${id}`, error.stack);
            throw new NotFoundException();
        }
    }

    async createExpense(
        createExpenseDto: CreateExpenseDto,
        user: JwtPayload,
    ): Promise<Expense> {
        const {title, amount, category} = createExpenseDto;

        const expense = this.expenseRepository.create({
            title,
            amount,
            category,
        });
        try {
            await this.expenseRepository.save(expense);

            this.logger.info(
                `Created expense`,
            );
            return expense;
        } catch (error) {
            this.logger.error("DB ERROR:", {
                message: error.message,
                code: error.code,
                detail: error.detail,
            });
            throw new NotFoundException();
        }
    }

    async aiCreateExpense(parsed: any): Promise<Expense> {
        const { title, amount, category } = parsed;

        const expense = this.expenseRepository.create({
            title,
            amount,
            category,
        });

        let saved: Expense;
        saved = await this.expenseRepository.save(expense);

        return saved;
    }

    async generateAiInsights(user: JwtPayload) {
        const since = new Date();
        since.setDate(since.getDate() - 30);

        const expenses = await this.expenseRepository.find({
            where: {
                createdAt: MoreThan(since),
            },
            order: { createdAt: 'ASC' },
        });

        const categoryTotals: Record<string, number> = {};
        let total = 0;

        for (const exp of expenses) {
            categoryTotals[exp.category] =
                (categoryTotals[exp.category] || 0) + exp.amount;
            total += exp.amount;
        }

        const payload = {
            totalSpent: total,
            categoryTotals,
            count: expenses.length,
            fromDate: since.toISOString(),
            toDate: new Date().toISOString(),
        };

        const insights = await this.aiService.generateInsights(payload);

        return { insights };
    }

    async handleAiQuery(query: string, user: JwtPayload) {
        const structured = await this.aiService.convertQuery(query);
        const result = await this.executeStructuredQuery(structured, user);

        const answer = await this.aiService.formatQueryAnswer(query, result);

        return { answer };
    }

    async executeStructuredQuery(structured: any, user: JwtPayload) {
        switch (structured.type) {
            case "merchant_total":
                return this.expenseRepository
                    .createQueryBuilder("exp")
                    .where("exp.title LIKE :m", { m: `%${structured.merchant}%` })
                    .select("SUM(exp.amount)", "total")
                    .getRawOne();

            case "category_total":
                return this.expenseRepository
                    .createQueryBuilder("exp")
                    .where("exp.category = :cat", { cat: structured.category })
                    .select("SUM(exp.amount)", "total")
                    .getRawOne();
        }
    }





    async updateExpense(
        updateExpenseDto: UpdateExpenseDto,
        user: JwtPayload,
        aiSuggest: boolean,
    ): Promise<any> {

        const { id, title, amount, category } = updateExpenseDto;

        let expense = await this.fetchExpense(id);

        expense.title = title;
        expense.amount = amount;
        expense.category = category;

        try {
            await this.expenseRepository.save(expense);
            this.logger.info('Updated expense.');

            expense = await this.fetchExpense(id);

            if (aiSuggest) {
                const suggestion = await this.aiService.suggestCategory(title || expense.title);

                return {
                    expense,
                    aiSuggestion: suggestion
                };
            }

            return { expense };

        } catch (error) {
            this.logger.error('Failed to update expense.', error.stack);
            throw new NotFoundException();
        }
    }


    async deleteExpense(deleteExpenseDto: DeleteExpenseDto): Promise<void> {
        const {id} = deleteExpenseDto;
        try {
            const result = await this.expenseRepository.softDelete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Expense with ID "${id}" not found`);
            }
            this.logger.info(`Deleted expense with id: ${id}`);
        } catch (error) {
            this.logger.error(
                `Failed to delete expense with id: ${id}`,
                error.stack,
            );
            throw new NotFoundException();
        }
    }
}
