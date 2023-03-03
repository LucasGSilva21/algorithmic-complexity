import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { NQueenService } from './n-queen.service';

@Controller('api/v1/n-queen')
export class NQueenController {
  constructor(private readonly nQueenService: NQueenService) {}

  @Get()
  async findAll() {
    return this.nQueenService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const nQueen = await this.nQueenService.findOne(id);

    if (!nQueen) {
      throw new BadRequestException(`nQueen with id ${id} not found`);
    }

    return nQueen;
  }

  @Post(':numberOfQueens')
  async sendToProcess(@Param('numberOfQueens') numberOfQueens: number) {
    return this.nQueenService.sendToProcess(numberOfQueens);
  }
}
