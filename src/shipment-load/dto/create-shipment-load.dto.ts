import { IsNumber } from "class-validator";

export class CreateShipmentLoadDto {



    initialLoadDate: string;

    lastUpdateDate: string;

    entryDate: string;

    @IsNumber()
    folio: number;




}
