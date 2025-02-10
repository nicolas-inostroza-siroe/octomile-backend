import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriversEntity } from './entities/drivers.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { CompanyEntity } from 'src/company/entities/company.entity';

@Injectable()
export class DriversService {
    private readonly uploadDir = 'uploads/drivers';

    constructor(
        @InjectRepository(DriversEntity)
        private readonly driverRepository: Repository<DriversEntity>,
        @InjectRepository(CompanyEntity)
        private readonly companyRepository: Repository<CompanyEntity>
    ) {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async create(createDriverDto: CreateDriverDto, files: Array<Express.Multer.File>) {
        let fileUrls: Record<string, string> = {};
        try {
            fileUrls = await this.saveFilesToLocal(files);
            console.log('fileUrls', fileUrls);
            const driverData = {
                ...createDriverDto,
                fecha_de_vencimiento_permiso_circulacion: String(createDriverDto.fecha_de_vencimiento_permiso_circulacion),
                fecha_de_vencimiento_revision_tecnica: String(createDriverDto.fecha_de_vencimiento_revision_tecnica),
                fecha_de_vencimiento_carnet_de_identidad: String(createDriverDto.fecha_de_vencimiento_carnet_de_identidad),
                fecha_de_vencimiento_licencia_conductor: String(createDriverDto.fecha_de_vencimiento_licencia_conductor),
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

        // Actualiza primero los campos de texto
        Object.assign(driver, updateDriverDto);

        // Luego, si se enviaron archivos, actualiza los campos de archivos
        if (files && files.length > 0) {
            const fileUrls = await this.saveFilesToLocal(files);
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

        return await this.driverRepository.save(driver);
    }


    async getEmpresas(){
        const empresasUnicas = await this.companyRepository
        .createQueryBuilder('company')
        .select('company.razonSocial', 'razonSocial')
        .addSelect('MIN(company.id)', 'id') // se toma el id mínimo para cada nombre único
        .groupBy('company.razonSocial')
        .getRawMany();

    // Transforma el resultado para devolver un array de objetos con id y razonSocial
    return empresasUnicas.map(item => ({
        id: +item.id, // convierte a número
        razonSocial: item.razonSocial,
    }));
    }
}
