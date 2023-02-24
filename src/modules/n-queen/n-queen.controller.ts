import { Controller, Param, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NQueenService } from './n-queen.service';

@Controller('api/v1/n-queen')
export class NQueenController {
  constructor(private readonly nQueenService: NQueenService) {}

  @Post(':numberOfQueens')
  async sendToProcess(
    @Param('numberOfQueens') numberOfQueens: number,
  ): Promise<any> {
    const result = await this.nQueenService.sendToProcess(numberOfQueens);
    console.log('####', result);
    return result.pipe();
  }

  @MessagePattern({ cmd: 'greeting-async' })
  async getNotifications(@Payload() data: any) {
    console.log('@@@@', data);
  }
}
