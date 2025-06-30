import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../categories/schemas/category.schema';
import { Product } from '../products/schemas/product.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const categoryModel = app.get<Model<Category>>(getModelToken(Category.name));
  const productoModel = app.get<Model<Product>>(getModelToken(Product.name));

  await categoryModel.deleteMany({});
  await productoModel.deleteMany({});

  const categories = await categoryModel.insertMany([
    { name: 'Café', description: 'Bebidas a base de café' },
    { name: 'Postres', description: 'Dulces y repostería' },
    { name: 'Té', description: 'Infusiones naturales y frías' },
  ]);

  const productos = [
    {
      name: 'Espresso',
      description: 'Café negro corto e intenso',
      price: 10,
      category: categories[0]._id,
    },
    {
      name: 'Latte',
      description: 'Café con leche espumosa',
      price: 15,
      category: categories[0]._id,
    },
    {
      name: 'Cheesecake',
      description: 'Tarta de queso con frutilla',
      price: 22,
      category: categories[1]._id,
    },
    {
      name: 'Té verde',
      description: 'Infusión antioxidante',
      price: 8,
      category: categories[2]._id,
    },
  ];

  await productoModel.insertMany(productos);

  console.log('categorías y productos de ejemplo guardadas correctamente');
  await app.close();
}

bootstrap();