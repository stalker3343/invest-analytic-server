import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { MoexService } from '../moex/moex.service';
import { PortfolioCurrencies, Rates } from '../portfolio/types';

import OpenAPI, {
  Portfolio,
  MarketInstrument,
} from '@tinkoff/invest-openapi-js-sdk';
const apiURL = 'https://api-invest.tinkoff.ru/openapi';
//const sandboxApiURL = 'https://api-invest.tinkoff.ru/openapi/sandbox/';

const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';

@Injectable()
export class TinkoffService {
  api: OpenAPI;
  instInfoByFigi: Record<string, MarketInstrument> = {};

  constructor(
    private configService: ConfigService, // private moexService: MoexService,
  ) {
    const token = this.configService.get<string>('TOKEN');
    this.api = new OpenAPI({
      apiURL: apiURL,
      secretToken: token,
      socketURL,
    });
  }
  async portfolio(): Promise<{
    portfolio: Portfolio;
    portfolioCurrencies: PortfolioCurrencies;
  }> {
    const portfolio = await this.api.portfolio();
    const portfolioCurrencies = await this.api.portfolioCurrencies();
    const RUB = portfolioCurrencies.currencies.find(
      (el) => el.currency === 'RUB',
    );
    const USD = portfolioCurrencies.currencies.find(
      (el) => el.currency === 'USD',
    );
    const EUR = portfolioCurrencies.currencies.find(
      (el) => el.currency === 'EUR',
    );
    return {
      portfolio,
      portfolioCurrencies: {
        RUB: RUB.balance,
        USD: USD.balance,
        EUR: EUR.balance,
      },
    };
  }

  async getRates(): Promise<Rates> {
    const { lastPrice: lastPriceUSD } = await this.api.orderbookGet({
      figi: 'BBG0013HGFT4',
      depth: 1,
    });

    const { lastPrice: lastPriceEUR } = await this.api.orderbookGet({
      figi: 'BBG0013HJJ31',
      depth: 1,
    });
    return {
      USD: lastPriceUSD,
      EUR: lastPriceEUR,
    };
  }

  async getDeals() {
    const now = new Date();
    const start = new Date('2021-02-20');

    let { operations } = await this.api.operations({
      from: start.toISOString(),
      to: now.toISOString(),
    });

    const dealsFigiInstr = operations
      .filter((el) => el.figi && !this.instInfoByFigi[el.figi])
      .map((el) => el.figi);
    const uniqueDealsFigiInstr = Array.from(new Set(dealsFigiInstr));
    const instrumentsInfo = await Promise.all(
      uniqueDealsFigiInstr.map((instr) => this.api.searchOne({ figi: instr })),
    );
    instrumentsInfo.forEach((info) => {
      this.instInfoByFigi[info.figi] = info;
    });

    operations = operations.map((el) => {
      const aditionalFields = el.figi
        ? {
            instrument: {
              ticker: this.instInfoByFigi[el.figi].ticker,
              name: this.instInfoByFigi[el.figi].name,
            },
          }
        : {};
      delete el['instrumentType'];
      delete el['figi'];
      delete el['isMarginCall'];
      delete el['quantityExecuted'];
      delete el['trades'];
      delete el['status'];
      delete el['id'];
      return {
        ...el,
        ...aditionalFields,
      };
    });

    return operations;
  }
}
