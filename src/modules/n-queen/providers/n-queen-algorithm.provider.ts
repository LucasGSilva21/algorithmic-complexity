import { Injectable } from '@nestjs/common';

@Injectable()
export class NQueensAlgorithmProvider {
  async handle(numberOfQueens: number) {
    console.log(numberOfQueens);
    const start = performance.now();
    const end = performance.now();

    return {
      result: {},
      totalTimeToProcess: Number(end - start),
    };
  }
}
