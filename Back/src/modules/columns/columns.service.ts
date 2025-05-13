import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column } from '../columns/shemas/column.shema';
import { CreateColumnDto } from './dto/create-column.dto';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel('Column') private columnModel: Model<Column>,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async findAll(): Promise<Column[]> {
    return this.columnModel.find().exec();
  }

  async findById(id: string): Promise<Column> {
    const column = await this.columnModel.findById(id).populate('cards').exec();
    if (!column) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    return column;
  }

  async create(data: CreateColumnDto): Promise<Column> {
    const newColumn = new this.columnModel(data);
    const savedColumn = await newColumn.save();
    this.realtimeGateway.emitColumnAdded(savedColumn);
    return savedColumn;
  }

  async update(id: string, data: Partial<CreateColumnDto>): Promise<Column> {
    const updatedColumn = await this.columnModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updatedColumn) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    this.realtimeGateway.emitColumnUpdated(updatedColumn);
    return updatedColumn;
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const deletedColumn = await this.columnModel.findByIdAndDelete(id).exec();
    if (!deletedColumn) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }

    this.realtimeGateway.emitColumnDeleted(id);

    return {
      success: true,
      message: 'Column deleted successfully',
    };
  }
}
