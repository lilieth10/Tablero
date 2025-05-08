import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCardDto {
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  columnId: string | Types.ObjectId;
}
