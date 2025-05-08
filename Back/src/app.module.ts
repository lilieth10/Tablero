import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsModule } from './modules/cards/cards.module';
import { ColumnsModule } from './modules/columns/columns.module';
import { RealtimeGateway } from './modules/realtime/realtime.gateway';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // esto es para cargar automáticamente el .env
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    CardsModule,
    ColumnsModule,
  ],
  controllers: [AppController],
  providers: [RealtimeGateway],
})
export class AppModule {}
