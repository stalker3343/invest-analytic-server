import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TinkoffModule } from './tinkoff/tinkoff.module';
import { MoexModule } from './moex/moex.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { DealsModule } from './deals/deals.module';

@Module({
  imports: [TinkoffModule, MoexModule, PortfolioModule, DealsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
