import { Controller, Get } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('portfolio-page')
  async portfolioByInstrumentType() {
    const res = await this.portfolioService.getPortfolioPage();
    return res;
  }

  @Get('/crossrate')
  async getRates() {
    const rates = await this.portfolioService.getRates();
    return rates;
  }
}
