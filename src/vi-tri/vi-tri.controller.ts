import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, UseInterceptors, Request, UploadedFile, UseGuards } from '@nestjs/common';
import { ViTriService } from './vi-tri.service';
import { CreateViTriDto } from './dto/create-vi-tri.dto';
import { UpdateViTriDto } from './dto/update-vi-tri.dto';
import { PrismaClient, viTri } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FileUploadDto } from '../dto/file-upload.dto';

@ApiTags("vi-tri")
@Controller('api/vi-tri')
export class ViTriController {

  constructor(private readonly viTriService: ViTriService) {}



  @Post()
  create(@Body() createViTriDto: CreateViTriDto) {
    return this.viTriService.create(createViTriDto);
  }

  @Get()
  findAll(): Promise<viTri[]> {
    return this.viTriService.findAll();
  }

  @Get('phan-trang-tim-kiem')
  findByPages(
    @Query('pageIndex') pageIndex: string,
    @Query('pageSize') pageSize: string,
    @Query('keyWord') keyWord: string, 
  ){
    return this.viTriService.findByPages(+pageIndex,+pageSize,keyWord)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viTriService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateViTriDto: UpdateViTriDto) {
    return this.viTriService.update(+id, updateViTriDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viTriService.remove(+id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    description: "Upload avatar"
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor("file",{
    storage: diskStorage({
      destination: process.cwd() + "/public/imgs/vi_tri",
      filename: (req, file, callback ) => callback(null, Date.now() + "_" + file.originalname)
    })
  }))
  @Post("upload-hinh-vi-tri")
  updateImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Query('id') id: string
  ){
    let user = req.user.data
    return this.viTriService.updateImage(user, file, +id)
  }
}
