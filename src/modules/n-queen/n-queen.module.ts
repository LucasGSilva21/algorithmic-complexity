import { Module } from '@nestjs/common';
import { NQueenService } from './n-queen.service';
import { NQueenController } from './n-queen.controller';

@Module({
  controllers: [NQueenController],
  providers: [NQueenService]
})
export class NQueenModule {}
