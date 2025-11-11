import {IsString, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';

export class UpdateExpenseDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsString()
    @IsOptional()
    title: string;

    @IsNumber()
    @IsOptional()
    amount: number;

    @IsString()
    @IsOptional()
    category: string;
}
