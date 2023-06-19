import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { PhongService } from './phong.service';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import { phong } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FileUploadDto } from '../dto/file-upload.dto';

@ApiTags("phong")
@Controller('api/phong')
export class PhongController {
  constructor(private readonly phongService: PhongService) {}


  @HttpCode(200)
  @Post()
  create(@Body() createPhongDto: CreatePhongDto) {
    return this.phongService.create(createPhongDto);
  }

  @Get()
  findAll(): Promise<phong[]> {
    return this.phongService.findAll();
  }

  @Get('lay-phong-theo-vi-tri')
  findByLocation(@Query('ma-vi-tri') maViTri: string){
    return this.phongService.findByLocation(+maViTri)
  }

  @Get("/phan-trang-tim-kiem")
  findByPages(
    @Query("pageIndex") pageIndex: string,
    @Query("pageSize") pageSize: string,
    @Query("keyWord") keyWord: string,
  ){
    return this.phongService.findByPages(+pageIndex, +pageSize, keyWord)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phongService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhongDto: UpdatePhongDto) {
    return this.phongService.update(+id, updatePhongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phongService.remove(+id);
  }


  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    description: "Upload avatar"
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file",{
    storage: diskStorage({
      destination: process.cwd() + "/public/imgs/phong",
      filename: (req, file, callback ) => callback(null, Date.now() + "_" + file.originalname)
    })
  }))
  @Post('upload-hinh-phong')
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Query('maPhong') id: string
  ){
    let user = req.user.data;
    return this.phongService.updateImage(user,file,+id)
  }
}
