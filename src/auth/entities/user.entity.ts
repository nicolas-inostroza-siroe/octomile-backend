
import { ShipmentMasterEntity } from "src/shipment-load/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_octomile")
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", {
        unique: true,
        name: "user_email"
    })
    email: string;

    @Column("varchar", {
        select: false
    })
    password: string;

    @Column("varchar")
    fullName: string;

    @Column("boolean", {
        default: true
    })
    isActive: string;

    @Column("json")
    roles: string[];

    @OneToMany(
        () => ShipmentMasterEntity,
        (shipmentMaster) => shipmentMaster.user,
    )
    shipmentMaster: ShipmentMasterEntity

    // @Column("text", {
    //     array: true,
    //     default: ["user"]
    // })
    // roles: string[];


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }


}
