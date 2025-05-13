import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './shemas/card.shema';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel('Card') private cardModel: Model<Card>,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async findAll(): Promise<Card[]> {
    return this.cardModel.find().exec();
  }

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const lastCard = await this.cardModel
      .find({ columnId: createCardDto.columnId })
      .sort({ position: -1 })
      .limit(1)
      .exec();

    const position = lastCard.length > 0 ? lastCard[0].position + 1 : 0;

    const createdCard = new this.cardModel({
      ...createCardDto,
      position,
    });
    const savedCard = await createdCard.save();
    this.realtimeGateway.emitCardAdded(savedCard);
    return savedCard;
  }

  async update(id: string, updateCardDto: Partial<Card>): Promise<Card | null> {
    const session = await this.cardModel.db.startSession();
    session.startTransaction();

    try {
      const existingCard = await this.cardModel.findById(id).exec();
      if (!existingCard) {
        throw new Error('Card not found');
      }

      if (
        updateCardDto.columnId &&
        !existingCard.columnId.equals(updateCardDto.columnId)
      ) {
        await this.cardModel.updateMany(
          {
            columnId: existingCard.columnId,
            position: { $gt: existingCard.position },
          },
          { $inc: { position: -1 } },
          { session }
        );

        await this.cardModel.updateMany(
          {
            columnId: updateCardDto.columnId,
            position: { $gte: updateCardDto.position || 0 },
          },
          { $inc: { position: 1 } },
          { session }
        );
      } else if (updateCardDto.position !== undefined) {
        const direction =
          updateCardDto.position > existingCard.position ? -1 : 1;
        await this.cardModel.updateMany(
          {
            columnId: existingCard.columnId,
            position: {
              $gte: Math.min(existingCard.position, updateCardDto.position),
              $lte: Math.max(existingCard.position, updateCardDto.position),
            },
          },
          { $inc: { position: direction } },
          { session }
        );
      }

      Object.assign(existingCard, updateCardDto);
      const updatedCard = await existingCard.save({ session });

      await session.commitTransaction();
      const result = updatedCard.toObject() as Card;
      
      if (updateCardDto.columnId && !existingCard.columnId.equals(updateCardDto.columnId)) {
        this.realtimeGateway.emitCardMoved({
          cardId: result.id,
          newColumnId: result.columnId.toString(),
          newPosition: result.position,
        });
      } else {
        this.realtimeGateway.emitCardUpdated(result);
      }
      
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      void session.endSession();
    }
  }

  async remove(id: string): Promise<Card | null> {
    const session = await this.cardModel.db.startSession();
    session.startTransaction();

    try {
      const cardToDelete = await this.cardModel.findById(id).exec();
      if (!cardToDelete) {
        throw new Error('Card not found');
      }

      await this.cardModel.updateMany(
        {
          columnId: cardToDelete.columnId,
          position: { $gt: cardToDelete.position },
        },
        { $inc: { position: -1 } },
        { session }
      );

      const deletedCard = await this.cardModel.findByIdAndDelete(id, {
        session,
      });
      await session.commitTransaction();
      
      if (deletedCard) {
        this.realtimeGateway.emitCardDeleted(deletedCard.id);
      }
      
      return deletedCard;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      void session.endSession();
    }
  }
}
