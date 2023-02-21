import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NQueen } from './entities/n-queen.entity';
import { ProcessStatus } from '../../shared/enums/process-status.enum';

@Injectable()
export class NQueenService {
  constructor(
    @InjectRepository(NQueen)
    private nQueensRepository: Repository<NQueen>,
  ) {}

  async sendToProcess(numberOfQueens: number) {
    const newNQueen = this.nQueensRepository.create({
      numberOfQueens,
      status: ProcessStatus.PENDING,
    });

    const { id } = await this.nQueensRepository.save(newNQueen);

    return { id };
  }
}
