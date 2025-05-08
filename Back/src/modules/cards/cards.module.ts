import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardSchema, CardModelName } from './shemas/card.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CardModelName, schema: CardSchema }]),
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
