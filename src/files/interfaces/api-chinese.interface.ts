

export interface ExcelChineseData {
    title: string;
    information: ChineseApiData[];
}

export interface ChineseApiData {
    consecutive: number;
    trackingID: number;
    carrierReferenceID: string;
    shipperName: string;
    shipperCity: string;
    shipperCountry: string;
    consigneeName: string;
    consigneeAddress: string;
    consigneeState: string;
    consigneeCity: string;
    consigneeCountry: string;
    consigneePhone: number;
    consigneeEmail: ConsigneeEmail;
    contentDescription: string;
    dangerousGood: string;
    declaredValue: string;
    grossWeight: string;
    dimentionalWeight: string;
    pieces: string;
    tipoIdentificacion: string;
    consigneeTaxID: string;
    codArancel: number;
    freightValue: string;
    idExterno: string;
    productUrl: ConsigneeEmail;
    bagId: string;
    taxType: string;
}

export interface ConsigneeEmail {
    text: string;
    hyperlink: string;
}



export const estructured: ChineseApiData = {
    consecutive: 0,
    trackingID: 0,
    carrierReferenceID: '',
    shipperName: '',
    shipperCity: '',
    shipperCountry: '',
    consigneeName: '',
    consigneeAddress: '',
    consigneeState: '',
    consigneeCity: '',
    consigneeCountry: '',
    consigneePhone: 0,
    consigneeEmail: null,
    contentDescription: '',
    dangerousGood: '',
    declaredValue: '',
    grossWeight: '',
    dimentionalWeight: '',
    pieces: '',
    tipoIdentificacion: '',
    consigneeTaxID: '',
    codArancel: 0,
    freightValue: '',
    idExterno: '',
    productUrl: null,
    bagId: '',
    taxType: ''
};
