import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfirmShiptmentDto, RequestShipmentDto, UpdateStatusShipmentDto, UploadStatusDto } from './dto';
import { SenhafferApiService } from 'src/senhaffer-api/senhaffer-api.service';
import { lastValueFrom } from 'rxjs';
import { ShipmentLoadService } from '../shipment-load/shipment-load.service';



@Injectable()
export class SortingService {

    constructor(
        private readonly senhafferApiService: SenhafferApiService,
        private readonly shipmentLoadService: ShipmentLoadService,
    ) { }


    async confirmShiptment(confirmShiptmentDto: ConfirmShiptmentDto) {
        const { hawbs, mawb } = await lastValueFrom(this.senhafferApiService.confirmShipmentsBySenhaffer(confirmShiptmentDto));

        const { shipment } = await this.shipmentLoadService.findAllShipmentLoadByFolio(mawb);

        if (!shipment) throw new NotFoundException(`shipment with ${mawb} not found`);

        const orderReadys = [];

        hawbs.forEach(order => {
            shipment.shipmentLoad = shipment.shipmentLoad.map(load => {
                if (load.idSistema === parseInt(order)) {
                    console.log('salta');
                    load.isConfirm = true;
                    orderReadys.push(load);
                }
                return load;
            });
        });
        shipment.lastUpdateDate = new Date();
        await this.shipmentLoadService.saveShipment(shipment);
        // await this.shipmentLoadService.updateShipment(mawb, shipment)
        return { message: 'shipment confirmed', code: HttpStatus.OK, orderReadys };
    }

    async requestDataShipment(requestShipmentDto: RequestShipmentDto) {
        const { mawb } = requestShipmentDto;
        const { shipment } = await this.shipmentLoadService.findAllShipmentLoadByFolio(mawb);

        if (!shipment) throw new NotFoundException(`shipment with ${mawb} not found`);

        const cargas = [shipment.shipmentLoad.filter(initial => initial.isConfirm == true)];
        if (cargas.length === 0) throw new BadRequestException(`shipments with ${mawb} loads not confirm yet`)

        return { message: 'shipment confirmed', code: HttpStatus.OK, idGuiaMaestra: mawb, cargas };
    }


    async updateStatus(updateStatusShipmentDto: UpdateStatusShipmentDto) {
        const { mawb, shipmentUpdate } = updateStatusShipmentDto;
        const { shipment } = await this.shipmentLoadService.findAllShipmentLoadByFolio(mawb);

        if (!shipment) throw new NotFoundException(`shipment with ${mawb} not found`);

        const orderReadys = [];

        shipmentUpdate.forEach(updateLoad => {
            shipment.shipmentLoad = shipment.shipmentLoad.map(load => {
                if (load.idSistema === parseInt(updateLoad.statusCode)) {
                    updateLoad.statusCode = updateLoad.statusCode;
                    orderReadys.push(updateLoad);
                }
                return load;
            });
        });
        await this.shipmentLoadService.saveShipment(shipment);

        return { message: 'shipment update', code: HttpStatus.OK, orderReadys };
    }

    async uploadStatus(uploadStatusDto: UploadStatusDto) {
        const { mawb, status, hawb } = uploadStatusDto;
        const { shipment } = await this.shipmentLoadService.findAllShipmentLoadByFolio(mawb);

        if (!shipment) throw new NotFoundException(`shipment with ${mawb} not found`);

        const hawbsUpdate = await lastValueFrom(this.senhafferApiService.uploadStatusLoadByShenhaffer(hawb, status));


    }

}
