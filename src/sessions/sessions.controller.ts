import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { PinchazoDto } from './dto/pinchazo.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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

  @Patch('pinchazo')
  pincharProducto(@Body() pinchazoDto: PinchazoDto) {
    return this.sessionsService.pincharProducto(pinchazoDto);
  }

  @Get("all-sessions")
  getAllsessions(@Query() paginationDto: PaginationDto) {
    return this.sessionsService.getAllSessions(paginationDto);
  }
}
