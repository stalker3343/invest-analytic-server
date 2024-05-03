import { Injectable } from '@nestjs/common';

@Injectable()
export class MoexService {
  async getRates() {
    const response = await fetch(
      'http://iss.moex.com/iss/engines/currency/markets/selt/boards/CETS/securities.json?iss.only=marketdata&marketdata.columns=SECID,LAST',
    );
    const res = await response.json();
    const [SECID, USD]: [string, number] = res.marketdata.data.find(
      ([SECID, LAST]) => SECID === 'USD000UTSTOM',
    );

    return {
      USD,
    };
  }
}
