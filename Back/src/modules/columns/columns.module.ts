import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { ColumnSchema } from './shemas/column.shema';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Column', schema: ColumnSchema }]),
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService, RealtimeGateway],
  exports: [ColumnsService],
})
export class ColumnsModule {}
