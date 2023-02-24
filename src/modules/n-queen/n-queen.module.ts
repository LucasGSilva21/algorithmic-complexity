import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NQueen } from './entities/n-queen.entity';
import { NQueenService } from './n-queen.service';
import { NQueenController } from './n-queen.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NQUEEN_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@rabbitmq:5672'],
          queue: 'n-queen-process',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([NQueen]),
  ],
  controllers: [NQueenController],
  providers: [NQueenService],
})
export class NQueenModule {}
