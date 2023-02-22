import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NQueen } from './entities/n-queen.entity';
import { NQueenService } from './n-queen.service';
import { NQueenController } from './n-queen.controller';
import { RabbitMQServer } from '../../shared/infra/rabbitmq-server';

@Module({
  imports: [TypeOrmModule.forFeature([NQueen])],
  controllers: [NQueenController],
  providers: [
    {
      provide: 'RABBIT_MQ_SERVER',
      useValue: new RabbitMQServer('amqp://admin:admin@rabbitmq:5672'),
    },
    NQueenService,
  ],
})
export class NQueenModule {}
