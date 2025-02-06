import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriversEntity } from './entities/drivers.entity';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class DriversService {
    private readonly uploadDir = 'uploads/drivers';

    constructor(
        @InjectRepository(DriversEntity)
        private readonly driverRepository: Repository<DriversEntity>
    ) {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async create(createDriverDto: CreateDriverDto, files: Array<Express.Multer.File>) {
        let fileUrls: Record<string, string> = {};
        try {
            fileUrls = await this.saveFilesToLocal(files);

            const driverData = {
                ...createDriverDto,
                fecha_de_vencimiento_permiso_circulacion: new Date(createDriverDto.fecha_de_vencimiento_permiso_circulacion).toISOString().split('T')[0],
                fecha_de_vencimiento_revision_tecnica: new Date(createDriverDto.fecha_de_vencimiento_revision_tecnica).toISOString().split('T')[0],
                fecha_de_vencimiento_carnet_de_identidad: new Date(createDriverDto.fecha_de_vencimiento_carnet_de_identidad).toISOString().split('T')[0],
                fecha_de_vencimiento_licencia_conductor: new Date(createDriverDto.fecha_de_vencimiento_licencia_conductor).toISOString().split('T')[0],
                permiso_circulacion: fileUrls['permiso_circulacion'] || null,
                revision_tecnica: fileUrls['revision_tecnica'] || null,
                soap_al_dia: fileUrls['soap_al_dia'] || null,
                Carnet_de_identidad_vigente: fileUrls['Carnet_de_identidad_vigente'] || null,
                licencia_conductor_vigente: fileUrls['licencia_conductor_vigente'] || null,
                certificado_antecedentes_vigente: fileUrls['certificado_antecedentes_vigente'] || null,
                certificado_anotaciones_vigente: fileUrls['certificado_anotaciones_vigente'] || null,
                fotografia1: fileUrls['fotografia1'] || null,
                fotografia2: fileUrls['fotografia2'] || null,
                fotografia3: fileUrls['fotografia3'] || null,
                fotografia4: fileUrls['fotografia4'] || null,
                status: 'active',
            };

            const driver = this.driverRepository.create(driverData);

            return await this.driverRepository.save(driver);

        } catch (error) {
            Object.values(fileUrls).forEach(filePath => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
            throw new Error(`Failed to create driver: ${error.message}`);
        }
    }

    private async saveFilesToLocal(files: Array<Express.Multer.File>): Promise<Record<string, string>> {
        const fileUrls: Record<string, string> = {};

        for (const file of files) {
            const uniqueFileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(this.uploadDir, uniqueFileName);

            await fs.promises.writeFile(filePath, file.buffer);
            fileUrls[file.fieldname] = filePath;
        }

        return fileUrls;
    }

    async findAll() {
        return await this.driverRepository.find();
    }

    async findOne(id: number) {
        return await this.driverRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const driver = await this.findOne(id);
        if (driver && driver.documents) {
            Object.values(driver.documents).forEach(filePath => {
                const pathString = filePath as string;
                if (fs.existsSync(pathString)) {
                    fs.unlinkSync(pathString);
                }
            });
        }
        return await this.driverRepository.delete(id);
    }


    async updateStatus(id: number, status: string) {
        const driver = await this.findOne(id);
        if (!driver) {
            throw new Error(`Driver with id ${id} not found`);
        }
        driver.status = status;
        return await this.driverRepository.save(driver);
    }

    async update(id: number, updateDriverDto: Partial<CreateDriverDto>, files: Array<Express.Multer.File>) {
        const driver = await this.findOne(id);
        if (!driver) {
            throw new HttpException(`Driver with id ${id} not found`, HttpStatus.NOT_FOUND);
        }

        // Process files if provided
        let fileUrls: Record<string, string> = {};
        if (files && files.length > 0) {
            fileUrls = await this.saveFilesToLocal(files);
            if (fileUrls['permiso_circulacion']) {
                driver.permiso_circulacion = fileUrls['permiso_circulacion'];
            }
            if (fileUrls['revision_tecnica']) {
                driver.revision_tecnica = fileUrls['revision_tecnica'];
            }
            if (fileUrls['soap_al_dia']) {
                driver.soap_al_dia = fileUrls['soap_al_dia'];
            }
            if (fileUrls['Carnet_de_identidad_vigente']) {
                driver.Carnet_de_identidad_vigente = fileUrls['Carnet_de_identidad_vigente'];
            }
            if (fileUrls['licencia_conductor_vigente']) {
                driver.licencia_conductor_vigente = fileUrls['licencia_conductor_vigente'];
            }
            if (fileUrls['certificado_antecedentes_vigente']) {
                driver.certificado_antecedentes_vigente = fileUrls['certificado_antecedentes_vigente'];
            }
            if (fileUrls['certificado_anotaciones_vigente']) {
                driver.certificado_anotaciones_vigente = fileUrls['certificado_anotaciones_vigente'];
            }
            if (fileUrls['fotografia1']) {
                driver.fotografia1 = fileUrls['fotografia1'];
            }
            if (fileUrls['fotografia2']) {
                driver.fotografia2 = fileUrls['fotografia2'];
            }
            if (fileUrls['fotografia3']) {
                driver.fotografia3 = fileUrls['fotografia3'];
            }
            if (fileUrls['fotografia4']) {
                driver.fotografia4 = fileUrls['fotografia4'];
            }
        }

        // Update non-file fields if provided
        Object.assign(driver, updateDriverDto);

        // Si se envían fechas, conviértelas a ISOString
        if (updateDriverDto.fecha_de_vencimiento_permiso_circulacion) {
            driver.fecha_de_vencimiento_permiso_circulacion = new Date(updateDriverDto.fecha_de_vencimiento_permiso_circulacion).toISOString();
        }
        if (updateDriverDto.fecha_de_vencimiento_revision_tecnica) {
            driver.fecha_de_vencimiento_revision_tecnica = new Date(updateDriverDto.fecha_de_vencimiento_revision_tecnica).toISOString();
        }
        if (updateDriverDto.fecha_de_vencimiento_carnet_de_identidad) {
            driver.fecha_de_vencimiento_carnet_de_identidad = new Date(updateDriverDto.fecha_de_vencimiento_carnet_de_identidad).toISOString();
        }
        if (updateDriverDto.fecha_de_vencimiento_licencia_conductor) {
            driver.fecha_de_vencimiento_licencia_conductor = new Date(updateDriverDto.fecha_de_vencimiento_licencia_conductor).toISOString();
        }

        return await this.driverRepository.save(driver);
    }

}
