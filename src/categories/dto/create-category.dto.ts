import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsUnique } from 'src/common/decorators/is-unique.decorator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsUnique('categories', 'name', {
    message: 'Category name must be unique',
  })

  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}