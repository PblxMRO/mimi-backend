import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { IsUnique } from '../../common/decorators/is-unique.decorator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsUnique('customers', 'email', { message: 'Email already registered' })
  email: string;

  @IsOptional()
  phone?: string;
}