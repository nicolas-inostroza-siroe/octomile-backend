import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateInitialShipmentDto, CreateUpdateInitialUpdateDto } from './dto';
import { Repository } from 'typeorm';
import { InitialLoadEntity, ShipmentLoadEntity, ShipmentUpdateEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateShipmentLoadDto } from './dto/update-shipment-load.dto';

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

    const { client, excel } = createInitialShipmentDto;

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
  }


  async findAllShipmentsInitial() {
    const cargas = await this.shipmentLoadRepository.find();
    return cargas;
  }

  async findAllShipments() {
    const shipments = await this.shipmentLoadRepository.find();
    return shipments.map(shipment => {
      const { initialLoad, ...rest } = shipment;
      return rest;
    });
  }


  async fillAllShipmentUpdate() {
    const shipmentsUpdate = await this.shipmentUpdateRepository.find();
    return shipmentsUpdate;
  }



  async initialLoadUpdate(createUpdateInitialUpdateDto: CreateUpdateInitialUpdateDto) {

    const { client, excel } = createUpdateInitialUpdateDto;

    try {

      let cargas = [];

      excel.forEach(element => {
        const item = this.shipmentUpdateRepository.create({ ...element });
        cargas.push(this.shipmentUpdateRepository.save(item));
      })
      await Promise.all(cargas);
      return { message: 'Carga exitosa', client };
    } catch (error) {
      this.handleExceptions(error);
    }


  }


  private handleExceptions(error: any) {
    if (error.code === "23505")
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException("Unexpected error , check server logs");
  }


}
