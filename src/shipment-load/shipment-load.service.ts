import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateInitialShipmentDto, CreateUpdateInitialUpdateDto } from './dto';
import { Repository } from 'typeorm';
import { InitialLoadEntity, ShipmentLoadEntity, ShipmentUpdateEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ShipmentLoadService {

  private readonly logger = new Logger('ShipmentLoadService');

  constructor(
    @InjectRepository(InitialLoadEntity)
    private readonly initialLoadRepository: Repository<InitialLoadEntity>,
    @InjectRepository(ShipmentLoadEntity)
    private readonly shipmentLoadRepository: Repository<ShipmentLoadEntity>,
    @InjectRepository(ShipmentUpdateEntity)
    private readonly shipmentUpdateRepository: Repository<ShipmentUpdateEntity>
  ) { }


  async createInitialLoad(createInitialShipmentDto: CreateInitialShipmentDto) {

    const { client, excel, idFolio } = createInitialShipmentDto;

    const dataSet = new Set<number>(excel.map(element => element.trackingID));
    const trakingIds = excel.map(element => element.trackingID);

    if (dataSet.size !== trakingIds.length) {
      this.logger.error(`There are repeated tracking ids`);
      throw new BadRequestException(`There are repeated tracking ids`);
    }

    try {

      const shipmentExist = await this.shipmentLoadRepository.findOneBy({ folio: idFolio });

      if (shipmentExist)
        throw new ConflictException(`An id ${idFolio} already exists for this shipment`);

      const carga = this.shipmentLoadRepository.create({
        initialLoadDate: new Date(),
        entryDate: new Date(),
        folio: idFolio,
        cliente: client,
        initialLoad: excel.map(element => this.initialLoadRepository.create({ ...element })),
      });

      await this.shipmentLoadRepository.save(carga);

      const { initialLoad, ...rest } = carga;

      return { message: 'Carga exitosa', client, initialLoad: rest };
    } catch (error) {
      console.log('salta error ');
      this.handleExceptions(error);
    }
  }


  async initialLoadUpdate(createUpdateInitialUpdateDto: CreateUpdateInitialUpdateDto) {

    const { client, excel, idFolio } = createUpdateInitialUpdateDto;

    const idSystems = excel.map(data => data.idSistema);
    const idSystemsSet = new Set(idSystems);

    if (idSystemsSet.size !== idSystems.length) {
      this.logger.error(`There are repeated id System`);
      throw new BadRequestException(`There are repeated id System`);
    }


    try {

      const data = await this.shipmentUpdateRepository.find({
        select: { idSistema: true },
      });

      const idSystemExcel: number[] = excel.map(data => data.idSistema);
      const idSystemDatabase: number[] = data.map(data => data.idSistema);
      const isIdSystemReapeat: boolean = idSystemDatabase.some(data => idSystemExcel.includes(data));

      if (isIdSystemReapeat) throw new ConflictException(`The idSystem  is repeat`);

      const shipment = await this.shipmentLoadRepository.findOne({
        where: { folio: idFolio },
        relations: { updateLoad: true }
      });

      if (!shipment) throw new NotFoundException(`Folio ${idFolio} not found`);

      const { updateLoad } = shipment;
      const isIdRepeat = updateLoad.some(data => idSystems.includes(data.idSistema));

      if (isIdRepeat) throw new ConflictException(`The idSystem  is repeat`);

      shipment.lastUpdateDate = new Date();
      shipment.updateLoad = excel.map(element => this.shipmentUpdateRepository.create({ ...element }));

      await this.shipmentLoadRepository.save(shipment);
      return { message: 'Carga exitosa', client, folio: idFolio };
    } catch (error) {
      this.handleExceptions(error);
    }

  }


  async findAllShipmentsByClient(client: string) {
    const shipment = await this.shipmentLoadRepository.find({
      where: { cliente: client },
      relations: { initialLoad: true, updateLoad: true }
    });
    if (shipment.length == 0) throw new NotFoundException(`The client ${client} not found`);
    return { message: 'all client data ', client: client, shipment };
  }

  async findAllShipmentsInitial(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const cargas = await this.initialLoadRepository.find({
      take: limit,
      skip: offset,
    });
    return { message: 'all initial shipments uploaded', code: HttpStatus.OK, shipments: cargas };
  }

  async findAllShipments(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const shipments = await this.shipmentLoadRepository.find({
      take: limit,
      skip: offset,
    });
    return { message: 'all shipments uploaded', code: HttpStatus.OK, shipments: shipments };
  }


  async findAllShipmentUpdate(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const shipmentsUpdate = await this.shipmentUpdateRepository.find({
      take: limit,
      skip: offset,
    });
    return { message: 'all update shipments uploaded', code: HttpStatus.OK, shipmentsUpdate: shipmentsUpdate };
  }

  async findAllShipmentUpdateByFolio(folio: string) {

    const shipment = await this.shipmentLoadRepository.findOne({
      where: { folio },
      select: { id: true, folio: true, cliente: true, updateLoad: true },
      relations: { updateLoad: true, },
    });

    if (!shipment) {
      this.logger.error(`Folio ${folio} is not found`);
      throw new NotFoundException(`Folio ${folio} is not found`);
    }

    return { message: 'ok', code: HttpStatus.OK, shipmentsUpdate: shipment };

  }


  async findShipmentLoadByFolio(folio: string) {
    const shipmentLoad = await this.shipmentLoadRepository.findOne({
      where: { folio },
      relations: { initialLoad: false, updateLoad: false }
    });

    if (!shipmentLoad) throw new NotFoundException(`Folio ${folio} is not found`)
    return { message: 'ok', code: HttpStatus.OK, shipmentLoad: shipmentLoad };
  }

  async findAllShipmentInitialByFolio(folio: string) {

    const shipment = await this.shipmentLoadRepository.findOne({
      where: { folio },
      select: { id: true, folio: true, cliente: true, initialLoad: true },
      relations: { initialLoad: true, },
    });

    if (!shipment) throw new NotFoundException(`Folio ${shipment.folio} is not found`);
    return { message: 'ok', code: HttpStatus.OK, shipmentInitial: shipment };

  }


  private handleExceptions(error: any) {
    console.log(error);
    this.logger.error(error);
    if (error.code === "23505")
      throw new BadRequestException(error.detail);

    if (error.status === HttpStatus.NOT_FOUND)
      throw new NotFoundException(error.response);

    if (error.status = HttpStatus.CONFLICT)
      throw new ConflictException(error.response);


    throw new InternalServerErrorException("Unexpected error , check server logs");
  }


}
