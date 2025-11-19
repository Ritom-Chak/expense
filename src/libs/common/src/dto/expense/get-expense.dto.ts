import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class GetExpenseDto {
    @Type(() => Number)
    @IsNumber()
    id: number;
}