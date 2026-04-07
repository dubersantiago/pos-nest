import { Product } from '../../products/entities/product.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:60})
    nombre:string
    
    @OneToMany(() => Product, (product)=>product.category, {cascade:true})
    products: Product[]
}
