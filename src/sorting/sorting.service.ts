import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfirmShiptmentDto, RequestShipmentDto, UpdateStatusShipmentDto } from './dto';
import { SenhafferApiService } from 'src/senhaffer-api/senhaffer-api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipmentLoadEntity } from 'src/shipment-load/entities';
import { Repository } from 'typeorm';
import { catchError, lastValueFrom } from 'rxjs';


@Injectable()
export class SortingService {

    constructor(
        @InjectRepository(ShipmentLoadEntity)
        private readonly shipmentLoadRepository: Repository<ShipmentLoadEntity>,
        private readonly senhafferApiService: SenhafferApiService,
    ) { }


    async confirmShiptment(confirmShiptmentDto: ConfirmShiptmentDto) {
        const { hawbs, mawb } = await lastValueFrom(this.senhafferApiService.confirmShipmentsBySenhaffer(confirmShiptmentDto));

        const shipment = await this.shipmentLoadRepository.findOne({
            where: { folio: mawb },
            relations: { initialLoad: true, updateLoad: true }
        });

        if (!shipment) throw new NotFoundException(`shipment with ${mawb} not found`);

        const orderReadys = [];

        hawbs.forEach(order => {
            shipment.initialLoad = shipment.initialLoad.map(initialLoad => {
                if (initialLoad.trackingID === +order) {
                    initialLoad.isConfirm = true
                    orderReadys.push(initialLoad);
                }
                return initialLoad;
            });

            shipment.updateLoad = shipment.updateLoad.map(updateLoad => {
                if (updateLoad.idSistema === +order) {
                    updateLoad.isConfirm = true;
                    orderReadys.push(updateLoad);
                }
                return updateLoad;
            });
        });

        await this.shipmentLoadRepository.save(shipment);

        return { message: 'shipment confirmed', code: HttpStatus.OK, orderReadys };

    }

    async requestDataShiptmet(requestShipmentDto: RequestShipmentDto) {
        const { mawb } = requestShipmentDto;
        const shipment = await this.shipmentLoadRepository.findOne({
            where: { folio: mawb },
            relations: { initialLoad: true, updateLoad: true }
        });

        if (!shipment) throw new NotFoundException(`shipment with ${mawb} not found`);

        const cargas = [shipment.initialLoad.filter(initial => initial.isConfirm == true), shipment.updateLoad.filter(update => update.isConfirm == true)];

        if (cargas.length === 0) throw new BadRequestException(`shipments with ${mawb} loads not confirm yet`)

        return { message: 'shipment confirmed', code: HttpStatus.OK, idGuiaMaestra: mawb, cargas };
    }


    async updateStatus(updateStatusShipmentDto: UpdateStatusShipmentDto) {
        const { mawb, shipmentUpdate } = updateStatusShipmentDto;
        const shipment = await this.shipmentLoadRepository.findOne({
            where: { folio: mawb },
            relations: { initialLoad: true, updateLoad: true }
        });

        if (!shipment) throw new NotFoundException(`shipment with ${mawb} not found`);

        const orderReadys = [];

        shipmentUpdate.forEach(updateLoad => {

            shipment.initialLoad = shipment.initialLoad.map(load => {
                if (load.trackingID === parseInt(updateLoad.statusCode)) {
                    load.statusCode = updateLoad.statusCode;
                    orderReadys.push(load);
                }
                return load;
            });

            shipment.updateLoad = shipment.updateLoad.map(load => {
                if (load.idSistema === parseInt(updateLoad.statusCode)) {
                    updateLoad.statusCode = updateLoad.statusCode;
                    orderReadys.push(updateLoad);
                }
                return load;
            });
        });
        await this.shipmentLoadRepository.save(shipment);

        return { message: 'shipment update', code: HttpStatus.OK, orderReadys };
    }

    async uploadStatusByCode(updateStatusShipment: UpdateStatusShipmentDto) {

    }

}
