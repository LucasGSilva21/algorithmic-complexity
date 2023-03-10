import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NQueen } from './entities/n-queen.entity';
import { NQueenService } from './n-queen.service';
import { NQueenController } from './n-queen.controller';
import { NQueensAlgorithmProvider } from './providers/n-queen-algorithm.provider';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Module({
  imports: [TypeOrmModule.forFeature([NQueen])],
  controllers: [NQueenController],
  providers: [
    {
      provide: 'RABBIT_MQ_SERVER',
      useClass: RabbitMQServer,
    },
    {
      provide: 'NQUEEN_PROVIDER',
      useClass: NQueensAlgorithmProvider,
    },
    NQueenService,
  ],
})
export class NQueenModule {}
