import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.ordersService.findAllPaginated(page, limit);
  }

  @Get('recent')
  findRecent(@Query('limit', ParseIntPipe) limit = 5) {
    return this.ordersService.findRecent(limit);
  }

  @Get('recent/completed')
  findRecentCompleted( @Query('limit', new DefaultValuePipe('5'), ParseIntPipe) limit: number,
) {
  return this.ordersService.findRecentCompleted(limit);
}


 @Get('customer/:customerId')
  findAllByCustomer(@Param('customerId') customerId: string) {
    return this.ordersService.findAllByCustomer(customerId);
  }

  @Get('customer/:customerId/completed')
  findCompletedByCustomer(@Param('customerId') customerId: string) {
    return this.ordersService.findCompletedByCustomer(customerId);
  }

  @Patch(':id/status')
 updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdateOrderStatusDto,
) {
  return this.ordersService.updateStatus(id, dto.status);
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}
