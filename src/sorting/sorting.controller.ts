import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SortingService } from './sorting.service';
import { ConfirmShiptmentDto, RequestShipmentDto, UpdateStatusShipmentDto } from './dto';


@Controller('sorting')
export class SortingController {
  constructor(private readonly sortingService: SortingService) { }

  @Post('confirmation')
  async confirmShipment(@Body() confirmShiptmentDto: ConfirmShiptmentDto) {
    return await this.sortingService.confirmShiptment(confirmShiptmentDto)
  }

  @Post('request')
  async requestData(@Body() requestShipmentDto: RequestShipmentDto) {
    return await this.sortingService.requestDataShiptmet(requestShipmentDto)
  }

  @Post('update-status')
  async updateLoadStatus(@Body() updateStatusShipmentDto: UpdateStatusShipmentDto) {
    return await this.sortingService.updateStatus(updateStatusShipmentDto)
  }

  //Consultar sobre el evento 4

  @Post('upload-status')
  async uploadShipmentStatus(@Body() updateStatusShipment: UpdateStatusShipmentDto) {
    return await this.sortingService.uploadStatusByCode(updateStatusShipment);
  }




}
