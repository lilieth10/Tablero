import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { ColumnSchema } from './shemas/column.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Column', schema: ColumnSchema }]),
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
