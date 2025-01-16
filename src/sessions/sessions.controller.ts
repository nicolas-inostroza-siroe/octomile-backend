import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, ConflictException } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { PinchazoDto } from './dto/pinchazo.dto';
import { pinchazoDisDto } from './dto/pinchazoDis.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { DeleteDisDto } from './dto/deleteDis.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }

  @Post('create')
  createSession(
    @Body() createSessionDto: CreateSessionDto
  ) {
    return this.sessionsService.createSession(createSessionDto);
  }

  @Post('modificate-status')
  modificateStatus(
    @Body() changeStatusDto: ChangeStatusDto
  ) {
    return this.sessionsService.changeStatus(changeStatusDto);
  }

  @Get('all-details/:id')
  getAllDetailsById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.sessionsService.getAllDetailsBySession(id);
  }

  @Get('statistics/:id')
  GetStatics(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.getSessionStatistics(id);
  }


  @Post("pinchazoDis")
  PinchazoDis(
    @Body() pinchazoDisDto: pinchazoDisDto
  ) {
    return this.sessionsService.productoDis(pinchazoDisDto);
  }



  @Patch('pinchazo')
  async pincharProducto(@Body() pinchazoDto: PinchazoDto) {
    return this.sessionsService.pincharProducto(pinchazoDto);
  }

  
  @Delete('delete-dis')
  async deletDis(@Body() deleteDisDto: DeleteDisDto) {
    return this.sessionsService.DeletDis(deleteDisDto);
  }


  @Patch('UpdateDis')
  async updateDis(@Body() deleteDisDto: DeleteDisDto) {
    return this.sessionsService.UpdateDis(deleteDisDto);
  }

  @Get("all-sessions")
  getAllsessions(@Query() paginationDto: PaginationDto) {
    return this.sessionsService.getAllSessions(paginationDto);
  }

  @Get("allActives-sessions")
  getAllActives() {
    return this.sessionsService.getAllActives();
  }


}


