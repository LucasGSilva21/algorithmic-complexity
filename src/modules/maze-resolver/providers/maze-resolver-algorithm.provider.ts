import { Injectable } from '@nestjs/common';

@Injectable()
export class MazeResolverAlgorithmProvider {
  handle(size: number) {
    console.log(size);
    const start = performance.now();
    const result = {};
    const end = performance.now();

    return {
      result,
      totalTimeToProcess: Number(end - start),
    };
  }
}
