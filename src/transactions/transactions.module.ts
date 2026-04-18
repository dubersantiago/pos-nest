import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Product } from 'src/products/entities/product.entity';
import { CouponService } from 'src/coupon/coupon.service';
import { CouponModule } from 'src/coupon/coupon.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Transaction,
      TransactionContents,
      Product
    ]),
    CouponModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
