import { Injectable } from '@nestjs/common';
import { excelData } from './interfaces/file.interfaces';
import * as ExcelJS from 'exceljs';
import { workerData } from 'worker_threads';
import { ChineseApiData, estructured, estructuredSenhaffer, ExcelChineseData, SenhafferCabecera } from './interfaces';
import { SenhafferApiService } from '../senhaffer-api/senhaffer-api.service';


@Injectable()
export class FilesService {


    constructor(private senhafferApiService: SenhafferApiService) { }

    async leerDatosExcel({ files }: excelData) {
        const workbook = new ExcelJS.Workbook();
        let booksData = [];

        for (const file of files) {
            const data = await workbook.xlsx.load(file.buffer);
            data.worksheets.forEach(worksheet => {
                worksheet.eachRow(row => {
                    row.eachCell(cell => {
                        booksData.push(cell.value); // Agrega cada celda al resultado
                    });
                });
            });
        }

        console.log('data Obtenida ', booksData);
        return booksData; // Retorna toda la información del workbook
    }


    async leerExcelChino(file: Express.Multer.File): Promise<ExcelChineseData[]> {
        const workbook = new ExcelJS.Workbook();
        const excel = await workbook.xlsx.load(file.buffer);
        const worksheet = excel.worksheets[0];

        let cabecera: string[] = [];
        let excelDatos: ChineseApiData[] = [];

        worksheet.getRow(1).eachCell((cell: ExcelJS.Cell) => {
            cabecera.push(cell.value.toString());
        });

        const datos: ExcelJS.Row[] = worksheet.getRows(2, worksheet.rowCount);

        datos.forEach((row: ExcelJS.Row) => {
            if (row.values.length === 0) return;
            let dato: ChineseApiData = { ...estructured };
            let numeroColumna: number = 0;
            row.eachCell((cell: ExcelJS.Cell, colNumber: number,) => {
                if (Math.abs(numeroColumna - colNumber) !== 1) {
                    numeroColumna = colNumber;
                    return
                }
                dato[Object.keys(dato)[colNumber - 1]] = cell.value;
                numeroColumna = colNumber
            })
            excelDatos.push(dato);
        });

        // this.senhafferApiService.loadOrders()

        return [{ title: file.originalname, information: excelDatos }];
    }


    async leerExcelComun(file: Express.Multer.File) {
        const workbook = new ExcelJS.Workbook();
        const excel = await workbook.xlsx.load(file.buffer);
        const worksheet = excel.worksheets[0];

        let cabecera: string[] = [];
        let excelDatos: SenhafferCabecera[] = [];

        worksheet.getRow(1).eachCell((cell: ExcelJS.Cell) => {
            cabecera.push(cell.value.toString());
        });

        const datos: ExcelJS.Row[] = worksheet.getRows(2, worksheet.rowCount);

        datos.forEach((row: ExcelJS.Row) => {
            if (row.values.length === 0) return;
            let dato: SenhafferCabecera = { ...estructuredSenhaffer };
            let numeroColumna: number = 0;
            row.eachCell((cell: ExcelJS.Cell, colNumber: number,) => {
                if (Math.abs(numeroColumna - colNumber) !== 1) {
                    numeroColumna = colNumber;
                    return
                }
                dato[Object.keys(dato)[colNumber - 1]] = cell.value;
                numeroColumna = colNumber
            })
            excelDatos.push(dato);
        });

        // this.senhafferApiService.loadOrders()

        return [{ title: file.originalname, information: excelDatos }];
    }

}
