import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { ConfigModule } from '@nestjs/config';
import { TinkoffService } from '../tinkoff/tinkoff.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [DealsController],
  providers: [DealsService, TinkoffService],
})
export class DealsModule {}
