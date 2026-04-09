import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CouponService {

  constructor(
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>
  ){}
  
  create(createCouponDto: CreateCouponDto) {
    return this.couponRepository.save(createCouponDto);
  }

  findAll() {
    return this.couponRepository.find();
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOneBy({id})
    if(!coupon) throw new NotFoundException(`El cupon con ID ${id} no existe`)
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const cuopon = await this.findOne(id);

    Object.assign(cuopon,updateCouponDto);

    return await this.couponRepository.save(cuopon);
  }

  async remove(id: number) {
    const cuopon = await this.findOne(id);

    await this.couponRepository.remove(cuopon);

    return {message:`Cupon eliminado`};
  }
}
