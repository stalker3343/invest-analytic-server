import { Controller, Get } from '@nestjs/common';
import { DealsService } from './deals.service';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get('/list')
  async portfolio() {
    const res = await this.dealsService.getDeals();
    return res;
  }
}
