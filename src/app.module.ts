import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NQueenModule } from './modules/n-queen/n-queen.module';

@Module({
  imports: [NQueenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
