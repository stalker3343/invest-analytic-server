import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { TinkoffService } from '../tinkoff/tinkoff.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [PortfolioController],
  providers: [PortfolioService, TinkoffService],
})
export class PortfolioModule {}
