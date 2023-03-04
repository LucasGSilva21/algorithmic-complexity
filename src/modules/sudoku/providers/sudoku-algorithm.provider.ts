import { Injectable } from '@nestjs/common';

@Injectable()
export class SudokuAlgorithmProvider {
  async handle(input: number[][]) {
    console.log(input);
    const start = performance.now();
    const end = performance.now();

    return {
      result: {},
      totalTimeToProcess: Number(end - start),
    };
  }
}
