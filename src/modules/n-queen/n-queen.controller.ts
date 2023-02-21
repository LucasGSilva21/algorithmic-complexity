import { Controller, Param, Post } from '@nestjs/common';
import { NQueenService } from './n-queen.service';

@Controller('api/v1/n-queen')
export class NQueenController {
  constructor(private readonly nQueenService: NQueenService) {}

  @Post(':numberOfQueens')
  sendToProcess(@Param('numberOfQueens') numberOfQueens: number) {
    return this.nQueenService.sendToProcess(numberOfQueens);
  }
}
