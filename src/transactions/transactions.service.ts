import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly TransactionContentsnRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly ProductRepository: Repository<Product>
  ){}


  async create(createTransactionDto: CreateTransactionDto) {
    const productsMap = new Map<number, Product>();
    for (const content of createTransactionDto.contents) {
      const product = await this.ProductRepository.findOneBy({
        id: content.productId,
      });

      if (!product) {
        throw new NotFoundException(`Producto con id ${content.productId} no existe`);
      }
      productsMap.set(content.productId, product);
    }

    const transaction = new Transaction()
    transaction.total=createTransactionDto.total;
    await this.transactionRepository.save(transaction)

    for(const content of createTransactionDto.contents){
      const product = productsMap.get(content.productId)

      if(content.quantity>product!.inventory) throw new NotFoundException(`El articulo ${product!.name} excede la cantidad disponible`);
      
      product!.inventory-=content.quantity
      await this.ProductRepository.save(product!);

      await this.TransactionContentsnRepository.save({...content, transaction, product})
    }

    return 'Venta Almacenada Correctamente';
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
