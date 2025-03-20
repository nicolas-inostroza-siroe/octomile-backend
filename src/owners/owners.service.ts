import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Owner } from './entities/owner.entity';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private ownersRepository: Repository<Owner>,
  ) {}

  /**
   * Crea un nuevo propietario
   * @param createOwnerDto Datos del propietario
   * @returns El propietario creado
   */
  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const newOwner = this.ownersRepository.create({
      ...createOwnerDto,
      estado: createOwnerDto.estado || 'Activo',
    });
    
    return await this.ownersRepository.save(newOwner);
  }

  /**
   * Obtiene todos los propietarios
   * @returns Lista de propietarios
   */
  async findAll(): Promise<Owner[]> {
    return await this.ownersRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  /**
   * Obtiene un propietario por su ID
   * @param id ID del propietario
   * @returns El propietario encontrado
   */
  async findOne(id: number): Promise<Owner> {
    const owner = await this.ownersRepository.findOne({
      where: { id: id },
    });
    
    if (!owner) {
      throw new NotFoundException(`Propietario con ID ${id} no encontrado`);
    }
    
    return owner;
  }

  /**
   * Actualiza un propietario existente
   * @param id ID del propietario
   * @param updateOwnerDto Datos a actualizar
   * @returns El propietario actualizado
   */
  async update(id: number, updateOwnerDto: UpdateOwnerDto): Promise<Owner> {
    const owner = await this.findOne(id);
    
    // Actualizar solo los campos proporcionados
    Object.assign(owner, updateOwnerDto);
    
    return await this.ownersRepository.save(owner);
  }

  /**
   * Elimina un propietario
   * @param id ID del propietario
   * @returns Resultado de la operación
   */
  async remove(id: number): Promise<{ message: string }> {
    const owner = await this.findOne(id);
    
    await this.ownersRepository.remove(owner);
    
    return { message: `Propietario con ID ${id} eliminado correctamente` };
  }
}
