import { Controller, Get, Post, Body, Param, Delete, HttpException, Put, Query, UseGuards, UploadedFile, UseInterceptors, Request } from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { nguoiDung } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FileUploadDto } from '../dto/file-upload.dto';

@ApiTags("Nguoi-dung")
@Controller('api/nguoi-dung')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) { }

  @Post()
  create(@Body() createNguoiDungDto: CreateNguoiDungDto): Promise<HttpException> {
    return this.nguoiDungService.create(createNguoiDungDto);
  }



  @Get()
  findAll(@Request() req): Promise<nguoiDung[]> {
    console.log(req.user)
    return this.nguoiDungService.findAll();
  }

  @Get("/phan-trang-tim-kiem")
  findByPages(
    @Query("pageIndex") pageIndex: string,
    @Query("pageSize") pageSize: string,
    @Query("keyWord") keyWord: string,
  ): Promise<nguoiDung[]> {
    return this.nguoiDungService.findByPages(+pageIndex, +pageSize, keyWord)
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<nguoiDung> {
    return this.nguoiDungService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateNguoiDungDto: UpdateNguoiDungDto) {
    return this.nguoiDungService.update(+id, updateNguoiDungDto);
  }

  @Get("search/:search")
  findSearch(@Param("search") search: string): Promise<nguoiDung[]> {
    return this.nguoiDungService.findSearch(search)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nguoiDungService.remove(+id);
  }


  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    description: "Upload avatar"
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/imgs/nguoi_dung",
      filename: (req, file, callback) => callback(null, Date.now() + "_" + file.originalname)
    })
  }))
  @Post('upload-avatar')
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    let user = req.user.data;
    return this.nguoiDungService.updateAvatar(user, file)
  }
}
