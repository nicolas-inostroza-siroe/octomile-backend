import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SortingService } from './sorting.service';
import { ConfirmShiptmentDto, RequestShipmentDto, UpdateStatusShipmentDto, UploadStatusDto } from './dto';


@Controller('sorting')
export class SortingController {
  constructor(private readonly sortingService: SortingService) { }

  @Post('confirmation')
  async confirmShipment(@Body() confirmShiptmentDto: ConfirmShiptmentDto) {
    return await this.sortingService.confirmShiptment(confirmShiptmentDto)
  }

  @Post('upload-status')
  async uploadShipmentStatus(@Body() updateStatusShipment: UploadStatusDto) {
    return await this.sortingService.uploadStatus(updateStatusShipment);
  }

  @Post('request')
  async requestData(@Body() requestShipmentDto: RequestShipmentDto) {
    return await this.sortingService.requestDataShipment(requestShipmentDto);
  }





}
