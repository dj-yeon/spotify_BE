import { ValidationArguments } from 'class-validator';

export const emailValidationMessage = (args: ValidationArguments) => {
  return `Please enter a valid value for ${args.property}!`;
};
