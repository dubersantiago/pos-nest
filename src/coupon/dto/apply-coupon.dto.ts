import { IsNotEmpty } from "class-validator";

export class ApplyCouponDto{
    @IsNotEmpty({message:'El nombre es obligatorio'})
    coupon_name!:string
}