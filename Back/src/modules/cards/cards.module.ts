import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardSchema, CardModelName } from './shemas/card.shema';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CardModelName, schema: CardSchema }]),
  ],
  controllers: [CardsController],
  providers: [CardsService, RealtimeGateway],
})
export class CardsModule {}
