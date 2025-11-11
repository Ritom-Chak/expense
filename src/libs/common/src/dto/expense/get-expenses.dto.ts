import {IsArray,IsString,IsNumber, IsOptional} from "class-validator";
import  {Type, Transform} from "class-transformer";

export class GetExpensesDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    id: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    pageSize: number;

    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @IsString()
    field: string;

    @IsOptional()
    @IsString()
    dir: string;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    ignoreRecords: number[];

}