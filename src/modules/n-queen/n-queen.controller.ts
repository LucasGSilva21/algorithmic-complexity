import { Controller } from '@nestjs/common';
import { NQueenService } from './n-queen.service';

@Controller('n-queen')
export class NQueenController {
  constructor(private readonly nQueenService: NQueenService) {}
}
