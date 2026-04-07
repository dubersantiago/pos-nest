import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {
    @IsNotEmpty({message:'El nombre del producto es obligatorio'})
    @IsString({message:'Nombre no valido'})
    name:string

    @IsNotEmpty({message:'El precio del producto es obligatorio'})
    @IsNumber({maxDecimalPlaces:2},{message:'Precio no valido'})
    price:number

    @IsNotEmpty({message:'La cantidad del producto es obligatorio'})
    @IsNumber({maxDecimalPlaces:0},{message:'cantidad no valida'})
    inventory:number

    @IsNotEmpty({message:'La categoria es obligatoria'})
    @IsInt({message:'La categoria no es valida'})
    categoryId:number
}
