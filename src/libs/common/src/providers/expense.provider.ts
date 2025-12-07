import {DataSource} from "typeorm";
import {Providers} from "../constants";
import {Expense} from "../entity";

export const ExpenseProviders = [
    {
        provide: Providers.EXPENSE_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Expense),
    }
]