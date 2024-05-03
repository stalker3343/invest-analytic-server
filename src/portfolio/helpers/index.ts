import {
  PortfolioPosition,
  Portfolio,
  Currencies,
} from '@tinkoff/invest-openapi-js-sdk';
import {
  Rates,
  PortfolioCurrencies,
  PortfolioByInstrumentType,
} from '../types';

export const groupePositionsByType = (positions) => {
  const instrumentTypes: Record<string, PortfolioPosition[]> = {};

  positions.reduce((acc, el) => {
    acc[el.instrumentType]
      ? acc[el.instrumentType].push(el)
      : (acc[el.instrumentType] = [el]);
    return acc;
  }, instrumentTypes);
  return instrumentTypes;
};

export const getTotalPositionPriceRUB = (
  position: PortfolioPosition,
  rates: Rates,
) => {
  const price =
    position.expectedYield.value +
    position.averagePositionPrice.value * position.balance;
  const currency = position.averagePositionPrice.currency;
  const RUBprice = currency === 'USD' ? price * rates.USD : price;
  return RUBprice;
};

export const getPortfolioPrice = (
  portfolio: Portfolio,
  portfolioCurrencies: PortfolioCurrencies,
  rates: Rates,
) => {
  let summ = 0;

  portfolio.positions.map((position) => {
    summ += getTotalPositionPriceRUB(position, rates);
  });

  summ += portfolioCurrencies.RUB;
  return summ;
};

export const getPortfolioCurrencyIndicators = (
  currency: string,
  portfolio: Portfolio,
  portfolioPrice: number,
  balance: number,
  rates: Rates,
) => {
  let profit = 0;
  let percent = (balance / portfolioPrice) * 100;

  const submolToFigi = {
    USD: 'BBG0013HGFT4',
    EUR: 'BBG0013HJJ31',
  };

  if (currency === 'USD' || currency === 'EUR') {
    const portfolioPosition = portfolio.positions.find(
      (el) => el.figi === submolToFigi[currency],
    );

    profit = portfolioPosition.expectedYield.value;
    percent = ((balance * rates[currency]) / portfolioPrice) * 100;
  }

  return { profit, percent };
};

export const groupPortfolioByInstrumentType = (
  portfolio: Portfolio,
  portfolioCurrencies: PortfolioCurrencies,
  rates: Rates,
  portfolioPrice: number,
) => {
  const instrumentTypes = groupePositionsByType(portfolio.positions);
  delete instrumentTypes['Currency'];
  const res: PortfolioByInstrumentType = [];

  // добавление акций
  for (const [instType, instTypePositions] of Object.entries(instrumentTypes)) {
    let instrumentTypePrice = 0;
    let instrumentTypeProfit = 0;

    instTypePositions.forEach((position) => {
      instrumentTypePrice += getTotalPositionPriceRUB(position, rates);
      instrumentTypeProfit += position.expectedYield.value;
    });

    res.push({
      instrumentType: instType,
      profit: instrumentTypeProfit,
      price: instrumentTypePrice,
      percent: (instrumentTypePrice / portfolioPrice) * 100,
    });
  }

  /// Добавление валют
  for (const [currency, balance] of Object.entries(portfolioCurrencies)) {
    if (balance === 0) continue;
    const { profit, percent } = getPortfolioCurrencyIndicators(
      currency,
      portfolio,
      portfolioPrice,
      balance,
      rates,
    );
    res.push({
      instrumentType: currency,
      profit,
      price: balance,
      percent,
    });
  }

  return res;
};

export const getInstrumentsIndicatorsByType = (
  type: 'Stock' | 'Etf',
  positions: PortfolioPosition[],
  portfolioPrice: number,
  rates: Rates,
) => {
  const stocks = positions.filter((el) => el.instrumentType === type);
  return stocks.map((el) => {
    const posTotalPrice = getTotalPositionPriceRUB(el, rates);
    return {
      name: el.name,
      balance: el.balance,
      percent: (posTotalPrice / portfolioPrice) * 100,
      profit: el.expectedYield.value,
      marketPrice: posTotalPrice / el.balance,
      marketValue: posTotalPrice,
    };
  });
};

export const getPortfolioIndicators = (
  portfolio: Portfolio,
  portfolioCurrencies: PortfolioCurrencies,
  rates: Rates,
) => {
  const portfolioPrice = getPortfolioPrice(
    portfolio,
    portfolioCurrencies,
    rates,
  );

  return [
    {
      title: 'Стоимость портфеля',
      value: portfolioPrice,
      suffix: '₽',
    },
  ];
};
