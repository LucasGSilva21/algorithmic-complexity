import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NQueen } from './entities/n-queen.entity';
import { NQueenService } from './n-queen.service';
import { NQueenController } from './n-queen.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NQueen])],
  controllers: [NQueenController],
  providers: [NQueenService],
})
export class NQueenModule {}
