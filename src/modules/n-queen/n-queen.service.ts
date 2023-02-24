import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'amqplib';
import { NQueen } from './entities/n-queen.entity';
import { ProcessStatus } from '../../shared/enums/process-status.enum';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Injectable()
export class NQueenService {
  constructor(
    @InjectRepository(NQueen)
    private nQueensRepository: Repository<NQueen>,
    @Inject('RABBIT_MQ_SERVER')
    private rabbitMQServer: RabbitMQServer,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMQServer.addSetup('n-queen', this.process);
  }

  async sendToProcess(numberOfQueens: number) {
    const newNQueen = this.nQueensRepository.create({
      numberOfQueens,
      status: ProcessStatus.PENDING,
    });

    const { id } = await this.nQueensRepository.save(newNQueen);

    await this.rabbitMQServer.publishInQueue(
      'n-queen',
      JSON.stringify({ id, numberOfQueens }),
    );

    return { id };
  }

  async process(message: Message) {
    console.log('@@@@', message.content.toString());
  }
}
