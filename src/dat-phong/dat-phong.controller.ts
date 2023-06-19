import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { DatPhongService } from './dat-phong.service';
import { CreateDatPhongDto } from './dto/create-dat-phong.dto';
import { UpdateDatPhongDto } from './dto/update-dat-phong.dto';
import { ApiBody, ApiConsumes, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';


@ApiTags("dat-phong")
@Controller('api/dat-phong')
export class DatPhongController {
  constructor(private readonly datPhongService: DatPhongService) {}


  @HttpCode(200)
  @Post()
  create(@Body() createDatPhongDto: CreateDatPhongDto) {
    return this.datPhongService.create(createDatPhongDto);
  }

  @HttpCode(200)
  @Get()
  findAll() {
    return this.datPhongService.findAll();
  }

  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datPhongService.findOne(+id);
  }

  @HttpCode(200)
  @Get('/lay-theo-nguoi-dung/:id')
  findByUser(@Param('id') id: string) {
    return this.datPhongService.findByUser(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatPhongDto: UpdateDatPhongDto) {
    return this.datPhongService.update(+id, updateDatPhongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.datPhongService.remove(+id);
  }
}
