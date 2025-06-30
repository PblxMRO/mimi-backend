import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schemas/customer.schema';
import { Model } from 'mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerFilterDto } from './dto/client-filter.dto';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private model: Model<Customer>) {}

  create(dto: CreateCustomerDto) {
    return this.model.create(dto);
  }

  findAll() {
    return this.model.find().exec();
  }

  findById(id: string) {
    return this.model.findById(id).exec();
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('customer not found');
    return updated;
  }

  async delete(id: string) {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('customer not found');
  }

  async findWithFilters(filters: CustomerFilterDto) {
  const query: any = {};

  if (filters.name) {
    query.name = { $regex: filters.name, $options: 'i' }; 
  }

  if (filters.email) {
    query.email = filters.email; 
  }

  return this.model.find(query).exec();
}

}
