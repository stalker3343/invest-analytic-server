import { Injectable } from '@nestjs/common';
import { TinkoffService } from '../tinkoff/tinkoff.service';
import {
  getPortfolioPrice,
  groupPortfolioByInstrumentType,
  getInstrumentsIndicatorsByType,
  getPortfolioIndicators,
} from './helpers';

@Injectable()
export class PortfolioService {
  constructor(private readonly tinkoffService: TinkoffService) {}

  async getPortfolioPage() {
    const { portfolio, portfolioCurrencies } =
      await this.tinkoffService.portfolio();

    const rates = await this.tinkoffService.getRates();

    const portfolioPrice = getPortfolioPrice(
      portfolio,
      portfolioCurrencies,
      rates,
    );
    const portfolioByInstrumentType = groupPortfolioByInstrumentType(
      portfolio,
      portfolioCurrencies,
      rates,
      portfolioPrice,
    );

    const stocks = getInstrumentsIndicatorsByType(
      'Stock',
      portfolio.positions,
      portfolioPrice,
      rates,
    );
    const funds = getInstrumentsIndicatorsByType(
      'Etf',
      portfolio.positions,
      portfolioPrice,
      rates,
    );

    const indicators = getPortfolioIndicators(
      portfolio,
      portfolioCurrencies,
      rates,
    );

    return {
      portfolioByInstrumentType,
      stocks,
      indicators,
      funds,
    };
  }

  async getRates() {
    return await this.tinkoffService.getRates();
  }
}
