import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NQueen } from './entities/n-queen.entity';
import { ProcessStatus } from '../../shared/enums/process-status.enum';

@Injectable()
export class NQueenService {
  constructor(
    @InjectRepository(NQueen) private nQueensRepository: Repository<NQueen>,
    @Inject('NQUEEN_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sendToProcess(numberOfQueens: number) {
    const newNQueen = this.nQueensRepository.create({
      numberOfQueens,
      status: ProcessStatus.PENDING,
    });

    const { id } = await this.nQueensRepository.save(newNQueen);

    const message = this.client.send(
      { cmd: 'greeting-async' },
      JSON.stringify({ id, numberOfQueens }),
    );

    return message;
  }
}
