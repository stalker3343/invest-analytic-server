import { Injectable } from '@nestjs/common';
import { TinkoffService } from '../tinkoff/tinkoff.service';

@Injectable()
export class DealsService {
  constructor(private readonly tinkoffService: TinkoffService) {}

  async getDeals() {
    const deals = await this.tinkoffService.getDeals();
    return deals.map((deal) => {
      return deal;
    });
  }
}
