import { Controller, Get } from '@nestjs/common';
import { MoexService } from './moex.service';

@Controller('moex')
export class MoexController {
  constructor(private readonly moexService: MoexService) {}
  @Get('/rates')
  async getRates() {
    const res = await this.moexService.getRates();
    return res;
  }
}
