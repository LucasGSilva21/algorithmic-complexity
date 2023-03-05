import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'amqplib';
import { Sudoku } from './entities/sudoku.entity';
import { SudokuAlgorithmProvider } from './providers/sudoku-algorithm.provider';
import { ProcessStatus } from '../../shared/enums/process-status.enum';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Injectable()
export class SudokuService {
  constructor(
    @InjectRepository(Sudoku)
    private sudokuRepository: Repository<Sudoku>,

    @Inject('RABBIT_MQ_SERVER')
    private rabbitMQServer: RabbitMQServer,

    @Inject('SUDOKU_PROVIDER')
    private sudokuAlgorithmProvider: SudokuAlgorithmProvider,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMQServer.addSetup('sudoku-process', this);
  }

  async findAll() {
    const sudokus = await this.sudokuRepository.find({
      select: {
        id: true,
        totalTimeToProcess: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return sudokus;
  }

  async findOne(id: string) {
    const sudoku = await this.sudokuRepository.findOne({ where: { id } });
    return sudoku;
  }

  async sendToProcess(input: JSON) {
    const newSudoku = this.sudokuRepository.create({
      input: input['sudoku'],
      status: ProcessStatus.PENDING,
    });

    const { id } = await this.sudokuRepository.save(newSudoku);

    await this.rabbitMQServer.publishInQueue(
      'sudoku-process',
      JSON.stringify({ id }),
    );

    return { id };
  }

  async process(message: Message) {
    const { id } = JSON.parse(message.content.toString());

    const sudoku = await this.sudokuRepository.findOne({ where: { id } });
    if (!sudoku) return;

    const input = sudoku.input as unknown as number[][];

    const { result, totalTimeToProcess } =
      this.sudokuAlgorithmProvider.handle(input);

    const updateData = {
      status: ProcessStatus.COMPLETED,
      totalTimeToProcess: totalTimeToProcess,
      result,
    };

    await this.sudokuRepository.save({ id, ...updateData });
  }
}
