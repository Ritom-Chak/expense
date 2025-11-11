import {IsNotEmpty, IsNumber} from "class-validator";

export class GetExpenseDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}