import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateShipmentDto, UpdateStatusLoadDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipmentLoadEntity, ShipmentMasterEntity } from './entities';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';
import { User } from 'src/auth/entities/user.entity';


@Injectable()
export class ShipmentLoadService {

  private readonly logger = new Logger('ShipmentLoadService');


  constructor(
    @InjectRepository(ShipmentMasterEntity)
    private readonly shipmentMasterRepository: Repository<ShipmentMasterEntity>,
    @InjectRepository(ShipmentLoadEntity)
    private readonly shipmentLoadRepository: Repository<ShipmentLoadEntity>,
    @InjectRepository(User)
    private readonly userOctomileRepository: Repository<User>,
    // private readonly commonService: CommonService,
  ) { }


  async createLoad(createShipmentDto: CreateShipmentDto, user: User) {

    const { client, idFolio, load } = createShipmentDto;

    const dataSet = new Set<number>(load.map(element => element.idSistema));
    const trakingIds = load.map(element => element.idSistema);

    if (dataSet.size !== trakingIds.length) {
      this.logger.error(`There are repeated tracking ids`);
      throw new BadRequestException(`There are repeated tracking ids`);
    }

    try {

      const isShipmentExist = await this.shipmentMasterRepository.findOneBy({ folio: idFolio });

      if (isShipmentExist)
        throw new ConflictException(`An id ${idFolio} already exists for this shipment`);

      const carga = this.shipmentMasterRepository.create({
        initialLoadDate: new Date(),
        entryDate: new Date(),
        folio: idFolio,
        cliente: client,
        user: user,
        shipmentLoad: load.map(element => this.shipmentLoadRepository.create({ ...element })),
      });

      await this.shipmentMasterRepository.save(carga);

      return { message: 'Carga exitosa', client, carga };
    } catch (error) {
      console.log('salta error ');
      this.logger.error(error);
      // this.commonService.handleExceptions(error);
    }
  }


  async updateLoadShipment(createShipmentDto: CreateShipmentDto) {

    const { client, idFolio, load } = createShipmentDto;

    const idSystems = load.map(data => data.idSistema);
    const idSystemsSet = new Set(idSystems);

    if (idSystemsSet.size !== idSystems.length) {
      this.logger.error(`There are repeated id System`);
      throw new BadRequestException(`There are repeated id System`);
    }

    try {

      const isShipmentExist = await this.shipmentMasterRepository.findOneBy({ folio: idFolio });

      if (!isShipmentExist)
        throw new ConflictException(`An id ${idFolio} not exists `);

      const data = await this.shipmentLoadRepository.find({
        select: { idSistema: true },
      });

      const idSystemExcel: number[] = load.map(data => data.idSistema);
      const idSystemDatabase: number[] = data.map(data => data.idSistema);
      const isIdSystemReapeat: boolean = idSystemDatabase.some(data => idSystemExcel.includes(data));

      if (isIdSystemReapeat) throw new ConflictException(`The idSystem  is repeat`);

      const shipment = await this.shipmentMasterRepository.findOne({
        where: { folio: idFolio },
        relations: { shipmentLoad: true }
      });

      if (!shipment) throw new NotFoundException(`Folio ${idFolio} not found`);

      const { shipmentLoad } = shipment;
      const isIdRepeat = shipmentLoad.some(data => idSystems.includes(data.idSistema));

      if (isIdRepeat) throw new ConflictException(`The idSystem  is repeat`);

      shipment.lastUpdateDate = new Date();
      const newLoads = load.map(element => this.shipmentLoadRepository.create({ ...element }));
      shipment.shipmentLoad.push(...newLoads);

      await this.shipmentMasterRepository.save(shipment);
      return { message: 'Carga exitosa', client, folio: idFolio };
    } catch (error) {
      this.logger.error(error);
      // this.commonService.handleExceptions(error);
    }

  }


  async findAllShipmentsByClient(client: string) {
    const shipment = await this.shipmentMasterRepository.find({
      where: { cliente: client },
      relations: { shipmentLoad: false },
    })
    if (shipment.length == 0) throw new NotFoundException(`The client ${client} not found`);
    return { message: 'all client data ', client: client, shipment };
  }

  async findAllShipmentsLoad(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const shipment = await this.shipmentLoadRepository.findAndCount({
      take: limit,
      skip: offset,
      select: { isActive: true }
    });
    const [cargas, numero] = shipment;
    return { message: 'all initial shipments uploaded', code: HttpStatus.OK, shipments: cargas, cantidadCargas: numero };
  }

  async findAllShipments(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const shipments = await this.shipmentMasterRepository.find({
      take: limit,
      skip: offset,
    });
    return { message: 'all shipments uploaded', code: HttpStatus.OK, shipments: shipments };
  }


  async findAllShipmentLoadByFolio(folio: string) {

    const shipment = await this.shipmentMasterRepository.findOne({
      where: { folio },
      select: { id: true, folio: true, cliente: true, shipmentLoad: true },
      relations: { shipmentLoad: true, },
    });

    if (!shipment) {
      this.logger.error(`Folio ${folio} is not found`);
      throw new NotFoundException(`Folio ${folio} is not found`);
    }

    return { message: 'ok', code: HttpStatus.OK, shipment: shipment };

  }

  async changeStatusLoad(updateStatusLoadDto: UpdateStatusLoadDto) {
    const { mawb, hawbs } = updateStatusLoadDto;
    const { shipment } = await this.findAllShipmentLoadByFolio(mawb);

    hawbs.forEach(hawb => {

      shipment.shipmentLoad = shipment.shipmentLoad.map(load => {
        if (load.idSistema === parseInt(hawb)) {
          load.isActive = !load.isActive;
        }
        return load;
      });
    });
    await this.shipmentMasterRepository.save(shipment)

    return { message: 'ok', code: HttpStatus.OK };
  }

  async saveShipment(shipment: ShipmentMasterEntity) {
    await this.shipmentMasterRepository.save(shipment);
  }

  async updateShipment(id: string, shipment: ShipmentMasterEntity) {
    await this.shipmentMasterRepository.update(id, shipment);
  }

}
