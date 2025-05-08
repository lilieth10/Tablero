import {
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Controller,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './shemas/card.shema';
import { Types } from 'mongoose';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async findAll(): Promise<Card[]> {
    return this.cardsService.findAll();
  }

  @Post()
  async create(@Body() createCardDto: CreateCardDto): Promise<Card> {
    if (typeof createCardDto.columnId === 'string') {
      createCardDto.columnId = new Types.ObjectId(createCardDto.columnId);
    }
    return this.cardsService.create(createCardDto);
  }

  @Patch(':id')
  async updateCard(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto
  ): Promise<Card | null> {
    if (updateCardDto.columnId && typeof updateCardDto.columnId === 'string') {
      updateCardDto.columnId = new Types.ObjectId(updateCardDto.columnId);
    }
    const updatedDto = {
      ...updateCardDto,
      columnId: updateCardDto.columnId
        ? new Types.ObjectId(updateCardDto.columnId)
        : undefined,
    };
    return this.cardsService.update(id, updatedDto);
  }

  @Delete(':id')
  async removeCard(@Param('id') id: string): Promise<Card | null> {
    return this.cardsService.remove(id);
  }
}
