import { IsMongoId, IsEnum, IsOptional, IsArray } from 'class-validator';

export enum OrderStatus {
  IN_PROGRESS = 'En Curso',
  COMPLETED = 'Terminada',
  CANCELLED = 'Cancelada',
}

export class CreateOrderDto {
  @IsMongoId()
  customer: string;

  @IsArray()
  @IsMongoId({ each: true })
  products: string[];

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}