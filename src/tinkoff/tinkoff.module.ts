import { Module } from '@nestjs/common';
import { TinkoffController } from './tinkoff.controller';
import { TinkoffService } from './tinkoff.service';
import { ConfigModule } from '@nestjs/config';
import { MoexService } from '../moex/moex.service';
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [TinkoffController],
  providers: [TinkoffService, MoexService],
  exports: [TinkoffService],
})
export class TinkoffModule {}
