import { Module } from '@nestjs/common';
import { MoexController } from './moex.controller';
import { MoexService } from './moex.service';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [MoexController],
  providers: [MoexService],
  exports: [MoexService],
})
export class MoexModule {}
