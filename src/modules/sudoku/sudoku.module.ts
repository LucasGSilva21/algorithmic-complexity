import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sudoku } from './entities/sudoku.entity';
import { SudokuService } from './sudoku.service';
import { SudokuController } from './sudoku.controller';
import { SudokuAlgorithmProvider } from './providers/sudoku-algorithm.provider';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Module({
  imports: [TypeOrmModule.forFeature([Sudoku])],
  controllers: [SudokuController],
  providers: [
    {
      provide: 'RABBIT_MQ_SERVER',
      useClass: RabbitMQServer,
    },
    {
      provide: 'SUDOKU_PROVIDER',
      useClass: SudokuAlgorithmProvider,
    },
    SudokuService,
  ],
})
export class SudokuModule {}
