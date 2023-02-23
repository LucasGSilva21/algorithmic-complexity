import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Channel, connect, Message } from 'amqplib';

@Injectable()
export class RabbitMQServer {
  private url: string;
  private conn: Connection;
  private channel: Channel;

  constructor(private configService: ConfigService) {}

  async start(): Promise<void> {
    const url = this.configService.get<string>('rabbitmq.url');
    this.url = url;
    this.conn = await connect(this.url);
    this.channel = await this.conn.createChannel();
  }

  async publishInQueue(queue: string, message: string) {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async publishInExchange(
    exchange: string,
    routingKey: string,
    message: string,
  ): Promise<boolean> {
    return this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(queue: string, callback: (message: Message) => void) {
    return this.channel.consume(queue, (message) => {
      callback(message);
      this.channel.ack(message);
    });
  }
}
