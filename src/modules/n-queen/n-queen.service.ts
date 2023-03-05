import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'amqplib';
import { NQueen } from './entities/n-queen.entity';
import { NQueensAlgorithmProvider } from './providers/n-queen-algorithm.provider';
import { ProcessStatus } from '../../shared/enums/process-status.enum';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Injectable()
export class NQueenService {
  constructor(
    @InjectRepository(NQueen)
    private nQueensRepository: Repository<NQueen>,

    @Inject('RABBIT_MQ_SERVER')
    private rabbitMQServer: RabbitMQServer,

    @Inject('NQUEEN_PROVIDER')
    private nQueensAlgorithmProvider: NQueensAlgorithmProvider,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMQServer.addSetup('n-queen-process', this);
  }

  async findAll() {
    const nQueens = await this.nQueensRepository.find();
    return nQueens;
  }

  async findOne(id: string) {
    const nQueen = await this.nQueensRepository.findOne({ where: { id } });
    return nQueen;
  }

  async sendToProcess(numberOfQueens: number) {
    const newNQueen = this.nQueensRepository.create({
      numberOfQueens,
      status: ProcessStatus.PENDING,
    });

    const { id } = await this.nQueensRepository.save(newNQueen);

    await this.rabbitMQServer.publishInQueue(
      'n-queen-process',
      JSON.stringify({ id }),
    );

    return { id };
  }

  async process(message: Message) {
    const { id } = JSON.parse(message.content.toString());

    const nQueen = await this.nQueensRepository.findOne({ where: { id } });
    if (!nQueen) return;

    const { result, totalTimeToProcess } = this.nQueensAlgorithmProvider.handle(
      nQueen.numberOfQueens,
    );

    const updateData = {
      status: ProcessStatus.COMPLETED,
      totalTimeToProcess: totalTimeToProcess,
      result,
    };

    await this.nQueensRepository.save({ id, ...updateData });
  }
}
