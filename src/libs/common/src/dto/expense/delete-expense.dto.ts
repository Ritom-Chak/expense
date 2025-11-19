import { IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class DeleteExpenseDto {
    @Type(() => Number)
    @IsNumber()
    id: number;
}