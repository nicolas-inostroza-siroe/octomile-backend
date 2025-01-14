
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
    
    @Column('int')
    min:number;
        
    @Column('int')
    max:number;

    @Column("json")
    config: any[];
}


