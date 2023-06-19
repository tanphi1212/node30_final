import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';
import { AuthGuard } from '@nestjs/passport';
import {  ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('binh-luan')
@Controller('api/binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Request() req,
    @Body() createBinhLuanDto: CreateBinhLuanDto) {
    let user = req.user.data
    return this.binhLuanService.create(createBinhLuanDto, user);
  }

  @Get()
  findAll() {
    return this.binhLuanService.findAll();
  }

  @Get('lay-binh-luan-theo-phong/:id')
  findByRoomId(@Param('id') id: string){
    return this.binhLuanService.findByRoomId(+id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.binhLuanService.findOne(+id);
  }

  
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBinhLuanDto: UpdateBinhLuanDto,@Request() req){
    let user = req.user.data

    return this.binhLuanService.update(+id, updateBinhLuanDto, user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    let user = req.user.data

    return this.binhLuanService.remove(+id, user);
  }
}
