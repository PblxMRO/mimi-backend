import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

 @Prop({ type: Types.ObjectId, ref: Category.name })
  category: Types.ObjectId;

}

export const ProductSchema = SchemaFactory.createForClass(Product);