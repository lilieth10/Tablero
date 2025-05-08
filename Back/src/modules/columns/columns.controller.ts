import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  findAll() {
    return this.columnsService.findAll();
  }

  @Post()
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnsService.create(createColumnDto);
  }

  @Delete(':id')
  async removeColumn(
    @Param('id') id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.columnsService.delete(id);
  }
}
