import { ShipmentUpdateEntity } from "../entities";


export interface createInitialLoadResponse {
    message: string;
    client: string;
}

export const mockCreateInitial = () => {
    return {
        message: 'test',
        client: 'falabella',
    }
}




