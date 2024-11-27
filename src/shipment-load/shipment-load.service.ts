import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateInitialShipmentDto } from './dto';
import { Repository } from 'typeorm';
import { InitialLoadEntity, ShipmentLoadEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShipmentLoadService {

  private readonly logger = new Logger('ShipmentLoadService');

  constructor(
    @InjectRepository(InitialLoadEntity)
    private readonly initialLoadRepository: Repository<InitialLoadEntity>,
    @InjectRepository(ShipmentLoadEntity)
    private readonly shipmentLoadRepository: Repository<ShipmentLoadEntity>,
  ) { }


  async createInitialLoad(createInitialShipmentDto: CreateInitialShipmentDto) {

    const { client, excel } = createInitialShipmentDto;

    console.log({ excel });
    try {

      const carga = this.shipmentLoadRepository.create({
        initialLoadDate: new Date(),
        entryDate: new Date(),
        folio: excel[0].carrierReferenceID,
        cliente: client,
        initialLoad: excel.map(element => this.initialLoadRepository.create({ ...element })),
      });

      await this.shipmentLoadRepository.save(carga);
      return { message: 'Carga exitosa', client, ...carga };
    } catch (error) {
      this.handleExceptions(error);
    }
    return { message: 'Carga exitosa', client };
  }


  async findAllShipmentsInitial() {
    const cargas = await this.shipmentLoadRepository.find();
    return cargas.map(carga => carga.initialLoad);
  }

  async findAllShipments() {
    const shipments = await this.shipmentLoadRepository.find();
    return shipments.map(shipment => {
      const { initialLoad, ...rest } = shipment;
      return rest;
    });
  }



  private handleExceptions(error: any) {

    if (error.code === "23505")
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException("Unexpected error , check server logs");
  }


}
