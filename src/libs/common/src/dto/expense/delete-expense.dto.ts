import {IsNotEmpty, IsNumber} from "class-validator";

export class DeleteExpenseDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}