import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponService } from 'src/coupon/coupon.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly TransactionContentsnRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly ProductRepository: Repository<Product>,
    private readonly cuopnService : CouponService
  ){}


  async create(createTransactionDto: CreateTransactionDto) {

    return await this.ProductRepository.manager.transaction(async (manager) => {

      const errors: any[] = [];
      const productsMap = new Map<number, Product>();
      const total= createTransactionDto.contents.reduce((total,item)=>total+(item.price*item.quantity),0)

      // 🔍 1. Validar productos
      for (const content of createTransactionDto.contents) {
        const product = await manager.findOneBy(Product, {
          id: content.productId,
        });

        if (!product) {
          errors.push({
            field: 'productId',
            message: `Producto con id ${content.productId} no existe`,
          });
          continue;
        }

        productsMap.set(content.productId, product);
      }

      // 🔍 2. Validar stock
      for (const content of createTransactionDto.contents) {
        const product = productsMap.get(content.productId);

        if (!product) continue;

        if (content.quantity > product.inventory) {
          errors.push({
            field: 'quantity',
            message: `Stock insuficiente para ${product.name}`,
          });
        }
      }

      // 🚨 3. Lanzar TODOS los errores juntos
      if (errors.length > 0) throw new BadRequestException( errors );
      
      // ✅ 4. Crear transacción UNA SOLA VEZ
      const transaction = manager.create(Transaction, {
        total: total,
      });

      if(createTransactionDto.cuopon){
        const coupon = await this.cuopnService.applyCuopon(createTransactionDto.cuopon);
        const discount = (coupon.percentage/100)*total;
        transaction.discount=discount
        transaction.cuopon=coupon.name
        transaction.total -= discount
      }

      await manager.save(transaction);

      // 💾 5. Guardar cambios
      for (const content of createTransactionDto.contents) {
        const product = productsMap.get(content.productId)!;

        product.inventory -= content.quantity;

        await manager.save(product);

        await manager.save(TransactionContents, {
          ...content,
          transaction,
          product,
        });
      }

      return transaction;
    });
  }

  findAll(transactionDate?:string) {
    const options:FindManyOptions<Transaction> = {
      relations:{
        contents:true
      }
    }

    if(transactionDate){
      const date = parseISO(transactionDate)
      if(!isValid(date)) throw new BadRequestException('Fecha no valida')

      const start=startOfDay(date)
      const end=endOfDay(date)

      options.where={
        transactionDate: Between(start,end)
      }
    }

    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction= await this.transactionRepository.findOne({
      where:{
        id
      },
      relations:{
        contents:true
      }
    });

    if(!transaction) throw  new NotFoundException(`Transaccion con el id ${id} no existe`);

    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: number) {
    const transaction =await this.findOne(id);

    for(const content of transaction.contents){
      const product = await this.ProductRepository.findOneBy({id:content.product.id});
      product!.inventory+=content.quantity
      await this.ProductRepository.save(product!)
      
      const transactionContent = await this.TransactionContentsnRepository.findOneBy({id:content.id});
      await this.TransactionContentsnRepository.remove(transactionContent!)
    }

    await this.transactionRepository.remove(transaction);

    return {message:`Venta eliminada`};
  }
}
