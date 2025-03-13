import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity, EstadoVehiculo } from './entities/vehicles.entity';
import { PropietarioVehiculoEntity } from './entities/prop-vehicles.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateVehicleStatusDto } from './dto/update-vehicle-status.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
    
    @InjectRepository(PropietarioVehiculoEntity)
    private readonly propietarioRepository: Repository<PropietarioVehiculoEntity>
  ) {}

  /**
   * Crea un nuevo vehículo con archivos adjuntos
   * @param createVehicleDto Datos del vehículo a crear
   * @param files Archivos (fotografías y documentos)
   * @returns El vehículo creado
   */
  async create(
    createVehicleDto: CreateVehicleDto,
    files: {
      fotografia1?: Express.Multer.File[],
      fotografia2?: Express.Multer.File[],
      fotografia3?: Express.Multer.File[],
      fotografia4?: Express.Multer.File[],
      permiso_circulacion?: Express.Multer.File[],
      revision_tecnica?: Express.Multer.File[],
      seguro?: Express.Multer.File[]
    }
  ): Promise<VehicleEntity> {
    // Verificar si ya existe un vehículo con la misma patente
    const existingVehicle = await this.vehicleRepository.findOne({ 
      where: { patente: createVehicleDto.patente } 
    });
    
    if (existingVehicle) {
      throw new BadRequestException(`Ya existe un vehículo con la patente ${createVehicleDto.patente}`);
    }
    
    // Ya no verificamos el propietario, simplemente usamos el valor proporcionado en el DTO
    
    // Crear el nuevo vehículo
    const newVehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      // Establecer valores predeterminados
      estado: createVehicleDto.estado || EstadoVehiculo.ACTIVO,
      documentos: {}
    });
    
    // Guardar primero para obtener el ID
    const savedVehicle = await this.vehicleRepository.save(newVehicle);
    
    // Después de guardar el vehículo, procesar y guardar los archivos
    await this.processFiles(savedVehicle, files);
    
    // Volver a cargar el vehículo con los datos actualizados
    return await this.vehicleRepository.findOne({ 
      where: { id_vehiculo: savedVehicle.id_vehiculo } 
    });
  }

  /**
   * Método privado para procesar los archivos subidos durante la creación
   * @param vehicle Vehículo guardado
   * @param files Archivos a procesar
   */
  private async processFiles(
    vehicle: VehicleEntity,
    files: {
      fotografia1?: Express.Multer.File[],
      fotografia2?: Express.Multer.File[],
      fotografia3?: Express.Multer.File[],
      fotografia4?: Express.Multer.File[],
      permiso_circulacion?: Express.Multer.File[],
      revision_tecnica?: Express.Multer.File[],
      seguro?: Express.Multer.File[]
    }
  ): Promise<void> {
    const vehiculoId = vehicle.id_vehiculo;
    
    // Crear directorios base si no existen
    const photoPath = path.join(process.cwd(), 'uploads', 'vehicles', vehiculoId.toString(), 'photos');
    const docsPath = path.join(process.cwd(), 'uploads', 'vehicles', vehiculoId.toString(), 'documents');
    
    if (!fs.existsSync(photoPath)) {
      fs.mkdirSync(photoPath, { recursive: true });
    }
    
    if (!fs.existsSync(docsPath)) {
      fs.mkdirSync(docsPath, { recursive: true });
    }
    
    // Procesar fotografías
    const updatedVehicle = { ...vehicle };
    
    // Si hay fotografías, procesarlas
    if (files.fotografia1 && files.fotografia1[0]) {
      updatedVehicle.fotografia1 = await this.saveFile(files.fotografia1[0], photoPath, 'foto1');
    }
    
    if (files.fotografia2 && files.fotografia2[0]) {
      updatedVehicle.fotografia2 = await this.saveFile(files.fotografia2[0], photoPath, 'foto2');
    }
    
    if (files.fotografia3 && files.fotografia3[0]) {
      updatedVehicle.fotografia3 = await this.saveFile(files.fotografia3[0], photoPath, 'foto3');
    }
    
    if (files.fotografia4 && files.fotografia4[0]) {
      updatedVehicle.fotografia4 = await this.saveFile(files.fotografia4[0], photoPath, 'foto4');
    }
    
    // Si no existe el campo documentos, inicializarlo
    if (!updatedVehicle.documentos) {
      updatedVehicle.documentos = {};
    }
    
    // Procesar documentos
    if (files.permiso_circulacion && files.permiso_circulacion[0]) {
      const filePath = await this.saveFile(files.permiso_circulacion[0], docsPath, 'permiso_circulacion');
      updatedVehicle.documentos.permiso_circulacion = filePath;
    }
    
    if (files.revision_tecnica && files.revision_tecnica[0]) {
      const filePath = await this.saveFile(files.revision_tecnica[0], docsPath, 'revision_tecnica');
      updatedVehicle.documentos.revision_tecnica = filePath;
    }
    
    if (files.seguro && files.seguro[0]) {
      const filePath = await this.saveFile(files.seguro[0], docsPath, 'seguro');
      updatedVehicle.documentos.seguro = filePath;
    }
    
    // Actualizar el vehículo con las rutas de archivos
    await this.vehicleRepository.update(vehiculoId, updatedVehicle);
  }
  
  /**
   * Método para guardar un archivo en disco
   * @param file Archivo a guardar
   * @param destinationPath Ruta de destino
   * @param prefix Prefijo para el nombre del archivo
   * @returns Ruta relativa al archivo guardado
   */
  private async saveFile(
    file: Express.Multer.File,
    destinationPath: string,
    prefix: string
  ): Promise<string> {
    const timestamp = new Date().getTime();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${prefix}_${timestamp}${fileExtension}`;
    const filePath = path.join(destinationPath, fileName);
    
    // Guardar el archivo en disco
    fs.writeFileSync(filePath, file.buffer);
    
    // Devolver ruta relativa para guardar en BD
    return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  }

  /**
   * Asigna un propietario a un vehículo
   * @param vehiculoId ID del vehículo
   * @param propietarioId ID del propietario
   * @returns El vehículo actualizado
   */
  async assignPropietario(vehiculoId: number, propietarioId: number): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id_vehiculo: vehiculoId }
    });
    
    if (!vehicle) {
      throw new NotFoundException(`No se encontró un vehículo con ID ${vehiculoId}`);
    }
    
    const propietario = await this.propietarioRepository.findOne({
      where: { id_propietario: propietarioId }
    });
    
    if (!propietario) {
      throw new NotFoundException(`No se encontró un propietario con ID ${propietarioId}`);
    }
    
    vehicle.id_propietario = propietarioId.toString();
    return await this.vehicleRepository.save(vehicle);
  }

  /**
 * Obtiene todos los vehículos
 * @returns Lista de vehículos
 */
async findAll(): Promise<VehicleEntity[]> {
  return await this.vehicleRepository.find({
    
    order: {
      id_vehiculo: 'DESC'
    }
  });
}


/**
 * Actualiza el propietario y/o estado de un vehículo
 * @param vehiculoId ID del vehículo a actualizar
 * @param updateDto Datos a actualizar
 * @returns Vehículo actualizado
 */
async updateVehicleStatus(
  vehiculoId: number, 
  updateDto: UpdateVehicleStatusDto
): Promise<VehicleEntity> {
  const vehicle = await this.vehicleRepository.findOne({
    where: { id_vehiculo: vehiculoId }
  });

  if (!vehicle) {
    throw new NotFoundException(`No se encontró un vehículo con ID ${vehiculoId}`);
  }

  // Actualizar propietario si se proporciona
  if (updateDto.id_propietario) {
    vehicle.id_propietario = updateDto.id_propietario;
  }

  // Actualizar estado si se proporciona
  if (updateDto.estado) {
    vehicle.estado = updateDto.estado;
  }

  // Guardar cambios
  return await this.vehicleRepository.save(vehicle);
}



}
