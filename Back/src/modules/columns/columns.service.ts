import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column } from './shemas/column.shema';
import { CreateColumnDto } from './dto/create-column.dto';

@Injectable()
export class ColumnsService {
  constructor(@InjectModel('Column') private columnModel: Model<Column>) {}

  async findAll(): Promise<Column[]> {
    return this.columnModel.find().populate('cards').exec();
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
    return await newColumn.save();
  }

  async update(id: string, data: Partial<CreateColumnDto>): Promise<Column> {
    const updatedColumn = await this.columnModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updatedColumn) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    return updatedColumn;
  }

  async delete(id: string): Promise<Column> {
    const deletedColumn = await this.columnModel.findByIdAndDelete(id).exec();
    if (!deletedColumn) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    return deletedColumn;
  }
}
