import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Den Kovalenko',
    description: "Ім'я користувача (тільки літери і пробіли)",
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({ message: "Ім'я не може бути порожнім" })
  @IsString({ message: "Ім'я має бути строкою" })
  @MinLength(2, { message: "Ім'я має бути мінімум 2 символи" })
  @MaxLength(50, { message: "Ім'я має бути максимум 50 символів" })
  @Matches(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'-]+$/, {
    message: "Ім'я може містити тільки літери, пробіли, дефіс та апостроф",
  })
  name: string;

  @ApiProperty({
    example: 'den@example.com',
    description: 'Email користувача',
  })
  @IsNotEmpty({ message: 'Email не може бути порожнім' })
  @IsEmail({}, { message: 'Невалідний формат email' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Пароль (мінімум 8 символів, має містити цифри та літери)',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Пароль не може бути порожнім' })
  @IsString({ message: 'Пароль має бути строкою' })
  @MinLength(8, { message: 'Пароль має бути мінімум 8 символів' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/, {
    message: 'Пароль має містити мінімум одну літеру та одну цифру',
  })
  password: string;
}
