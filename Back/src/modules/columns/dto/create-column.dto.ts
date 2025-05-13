import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsInt({ message: 'La posición debe ser un número entero' })
  @Min(0, { message: 'La posición no puede ser negativa' })
  position: number;
}
