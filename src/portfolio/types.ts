import { Operation } from '@tinkoff/invest-openapi-js-sdk';

export type PortfolioByInstrumentType = {
  instrumentType: string;
  profit: number;
  price: number;
  percent: number;
}[];

export type Rates = {
  USD: number;
  EUR: number;
};

export type AvailableCurrencies = 'USD' | 'RUB' | 'EUR';
export type PortfolioCurrencies = Record<AvailableCurrencies, number>;
