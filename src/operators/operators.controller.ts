import { Body, Controller, Get, Param, Post, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OperatorsService } from './operators.service';
import { CreateOpertorDto } from './dto/create-operator.dto';

@Controller('operators')
export class OperatorsController {
    constructor (private readonly operatorsService: OperatorsService) {}

@Post("create")
create(@Body() createOperatorDto: CreateOpertorDto) {
    return this.operatorsService.create(createOperatorDto);

}

@Get("GetAll")
getAll() {
    return this.operatorsService.getAll();
}

    
@Put('update')
@ApiOperation({ summary: 'Update operator using query parameter' })
@ApiQuery({ name: 'id', type: 'number', required: true })
@ApiResponse({ status: 200, description: 'Operator updated successfully' })
async update(
    @Query('id', ParseIntPipe) id: number,
    @Body() updateOperatorDto: CreateOpertorDto
) {
    return await this.operatorsService.update(id, updateOperatorDto);
}
}






