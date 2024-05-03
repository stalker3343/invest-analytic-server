import { Controller, Get, Post, Query } from '@nestjs/common';
import { TinkoffService } from './tinkoff.service';

@Controller('tinkoff')
export class TinkoffController {
  constructor(private readonly tinkoffService: TinkoffService) {}

  // @Get('/portfolio')
  // async portfolio() {
  //   const res = await this.tinkoffService.portfolio();
  //   return res;
  // }

  // @Get('/crossrate')
  // async getRates() {
  //   const rates = await this.tinkoffService.getRates();
  //   return rates;
  // }

  // @Get('/deals')
  // async getDeals() {
  //   const deals = await this.tinkoffService.getDeals();
  //   return deals;
  // }
}
