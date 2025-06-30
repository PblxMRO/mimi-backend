import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../customers/schemas/customer.schema';
import { Product } from '../products/schemas/product.schema';
import { Order } from '../orders/schemas/order.schema';
import { OrderStatus } from '../orders/dto/create-order.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const customerModel = app.get<Model<Customer>>(getModelToken(Customer.name));
  const productModel = app.get<Model<Product>>(getModelToken(Product.name));
  const orderModel = app.get<Model<Order>>(getModelToken(Order.name));

  await orderModel.deleteMany({});
  await customerModel.deleteMany({});

  const mockCustomers = await customerModel.insertMany([
    { name: 'Ana Torres', email: 'ana@example.com', phone: '+59170000001' },
    { name: 'Carlos Rojas', email: 'carlos@example.com', phone: '+59170000002' },
    { name: 'Elena Quispe', email: 'elena@example.com' },
  ]);

  const products = await productModel.find();
  if (products.length === 0) {
    console.warn(' No hay productos en la base. Por favor, ejecuta primero el seeder de productos.');
    return await app.close();
  }

  const allStatuses = [
    OrderStatus.COMPLETED,
    OrderStatus.IN_PROGRESS,
    OrderStatus.CANCELLED,
  ];

  const orders: any[] = [];

  for (let i = 0; i < 8; i++) {
    orders.push({
      customer: mockCustomers[0]._id,
      products: randomProducts(products, 2),
      status: i < 6 ? OrderStatus.COMPLETED : OrderStatus.IN_PROGRESS,
    });
  }

  for (let i = 0; i < 7; i++) {
    orders.push({
      customer: mockCustomers[1]._id,
      products: randomProducts(products, 3),
      status: i < 4 ? OrderStatus.COMPLETED : OrderStatus.IN_PROGRESS,
    });
  }

  for (let i = 0; i < 5; i++) {
    orders.push({
      customer: mockCustomers[2]._id,
      products: randomProducts(products, 1 + (i % 2)),
      status: i < 2 ? OrderStatus.CANCELLED : allStatuses[i % 4],
    });
  }

  await orderModel.insertMany(orders);

  console.log(` Seeded ${orders.length} orders for ${mockCustomers.length} customers`);
  await app.close();
}

function randomProducts(products: Product[], count: number) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((p) => p._id);
}

bootstrap();