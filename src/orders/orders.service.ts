import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model, Types } from 'mongoose';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly model: Model<Order>,
  ) {}

   async create(dto: CreateOrderDto) {
    return this.model.create(dto);
  }

  
  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid order ID');
  }
    const order = await this.model
      .findById(id)
      .populate('customer')
      .populate('products')
      .exec();

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

   async findAll() {
    return this.model.find().populate('customer').populate('products').exec();
  }

  async findRecent(limit = 10) {
    return this.model
      .find()
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('customer')
      .populate('products')
      .exec();
  }

  async findRecentCompleted(limit = 5) {
    return this.model
      .find({ status: OrderStatus.COMPLETED })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('customer')
      .populate('products')
      .exec();
  }

  
  async findCompletedByCustomer(customerId: string) {
    return this.model
      .find({ customer: customerId, status: OrderStatus.COMPLETED })
      .sort({ updatedAt: -1 })
      .populate('products')
      .exec();
  }

   async findAllByCustomer(customerId: string) {
    return this.model
      .find({ customer: customerId })
      .sort({ createdAt: -1 })
      .populate('products')
      .exec();
  }

  async update(id: string, dto: UpdateOrderDto) {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('customer')
      .populate('products')
      .exec();

    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }

  async findAllPaginated(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.model
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('customer')
      .populate('products')
      .exec(),
    this.model.countDocuments(),
  ]);

  return {
    total,
    page,
    limit,
    data,
  };
}

async updateStatus(id: string, status: OrderStatus) {
  const order = await this.model
    .findByIdAndUpdate(id, { status }, { new: true })
    .populate('customer products')
    .exec();

  if (!order) throw new NotFoundException('Order not found');
  return order;
}


  async delete(id: string) {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Order not found');
  }
}