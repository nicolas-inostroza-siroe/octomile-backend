
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"


@Entity('operators')
export class Operator {
	@PrimaryGeneratedColumn()
    id:number

    @Column('varchar',)
    name:string;
     
    @Column('varchar')
    configDirectExit:string;

    @Column('varchar')
    qtyRoutes:string;
    
    @Column('varchar')
    min:string;
        
    @Column('varchar')
    max:string;

    @Column("json")
    config: any[];
}


