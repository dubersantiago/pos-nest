import { IsString,IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {

    @IsString({message:"El campo name debe ser un string"})
    @IsNotEmpty({message:"El campo name no puede estar vacío"})
    name:string
}
