import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'El columnId es obligatorio' })
  columnId: string | Types.ObjectId;

  @IsInt({ message: 'La posición debe ser un número entero' })
  @Min(0, { message: 'La posición no puede ser negativa' })
  position: number;

  description?: string;
}
