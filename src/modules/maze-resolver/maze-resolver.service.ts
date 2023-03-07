import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'amqplib';
import { MazeResolver } from './entities/maze-resolver.entity';
import { MazeResolverAlgorithmProvider } from './providers/maze-resolver-algorithm.provider';
import { ProcessStatus } from '../../shared/enums/process-status.enum';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Injectable()
export class MazeResolverService {
  constructor(
    @InjectRepository(MazeResolver)
    private mazeResolverRepository: Repository<MazeResolver>,

    @Inject('RABBIT_MQ_SERVER')
    private rabbitMQServer: RabbitMQServer,

    @Inject('MAZE_RESOLVER_PROVIDER')
    private mazeResolverAlgorithmProvider: MazeResolverAlgorithmProvider,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMQServer.addSetup('maze-resolver-process', this);
  }

  async findAll() {
    const mazeResolvers = await this.mazeResolverRepository.find({
      select: {
        id: true,
        size: true,
        totalTimeToProcess: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return mazeResolvers;
  }

  async findOne(id: string) {
    const mazeResolver = await this.mazeResolverRepository.findOne({
      where: { id },
    });
    return mazeResolver;
  }

  async sendToProcess(size: number) {
    const newMazeResolver = this.mazeResolverRepository.create({
      size,
      status: ProcessStatus.PENDING,
    });

    const { id } = await this.mazeResolverRepository.save(newMazeResolver);

    await this.rabbitMQServer.publishInQueue(
      'maze-resolver-process',
      JSON.stringify({ id }),
    );

    return { id };
  }

  async process(message: Message) {
    const { id } = JSON.parse(message.content.toString());

    const mazeResolver = await this.mazeResolverRepository.findOne({
      where: { id },
    });
    if (!mazeResolver) return;

    const { result, totalTimeToProcess } =
      this.mazeResolverAlgorithmProvider.handle(mazeResolver.size);

    const updateData = {
      status: ProcessStatus.COMPLETED,
      totalTimeToProcess: totalTimeToProcess,
      result,
    };

    await this.mazeResolverRepository.save({ id, ...updateData });
  }
}
