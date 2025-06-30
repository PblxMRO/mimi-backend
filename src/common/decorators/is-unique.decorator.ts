import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueConstraint } from '../validators/is-unique.validator';

export function IsUnique(
  collection: string,
  field?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [collection, field],
      validator: IsUniqueConstraint,
    });
  };
}