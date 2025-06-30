import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [collectionName, field = args.property] = args.constraints;
    const exists = await this.connection.collection(collectionName).findOne({ [field]: value });
    return !exists;
  }

  defaultMessage(args: ValidationArguments) {
    const [collectionName, field] = args.constraints;
    return `The value '${args.value}' for '${field}' already exists in '${collectionName}'`;
  }
}