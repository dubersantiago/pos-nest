import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation/id-validation.pipe';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',IdValidationPipe) id: string) {
    return this.couponService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id',IdValidationPipe) id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(+id, updateCouponDto);
  }

  @Delete(':id')
  remove(@Param('id',IdValidationPipe) id: string) {
    return this.couponService.remove(+id);
  }

  @Post('/apply')
  @HttpCode(200)
  applyCuopon(@Body() applyCouponDto:ApplyCouponDto){
    return this.couponService.applyCuopon(applyCouponDto.coupon_name)
  }
}
