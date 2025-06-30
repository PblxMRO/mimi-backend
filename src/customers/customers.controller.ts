import { Controller, Post, Get, Param, Put, Delete, Body, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('Customers')
export class CustomersController {
  constructor(private readonly CustomersService: CustomersService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.CustomersService.create(dto);
  }

  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
  ) {
    return this.CustomersService.findWithFilters({ name, email });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.CustomersService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.CustomersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.CustomersService.delete(id);
  }
}