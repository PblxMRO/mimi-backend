import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';


@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductoDto: CreateProductDto): Promise<Product> {
    const nuevoProducto = new this.productModel(createProductoDto);
    return nuevoProducto.save();
  }

  async obtenerTodos(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findById(id: string): Promise<Product> {
    const producto = await this.productModel.findById(id).exec();
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async update(id: string, updateDto: UpdateProductDto): Promise<Product> {
    const actualizado = await this.productModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!actualizado) throw new NotFoundException('Producto no encontrado');
    return actualizado;
  }

  async delete(id: string): Promise<void> {
    const resultado = await this.productModel.findByIdAndDelete(id).exec();
    if (!resultado) throw new NotFoundException('Producto no encontrado');
  }

  async findWithFilters(filters: ProductFilterDto) {
  const {
    category,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'asc',
  } = filters;

  const query: any = {};

  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;
  const sort: any = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [data, total] = await Promise.all([
    this.productModel
      .find(query)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec(),
    this.productModel.countDocuments(query),
  ]);

  return {
    total,
    page,
    limit,
    data,
  };
}


}