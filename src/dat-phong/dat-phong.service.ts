import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDatPhongDto } from './dto/create-dat-phong.dto';
import { UpdateDatPhongDto } from './dto/update-dat-phong.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatPhongService {

  private prisma = new PrismaClient()

  async create(createDatPhongDto: CreateDatPhongDto) {
    let { ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat } = createDatPhongDto;

    await this.prisma.datPhong.create({
      data:{
        ma_phong,
        ngay_den,
        ngay_di,
        so_luong_khach,
        ma_nguoi_dat
      }
    })

    return 'Thêm mới thành công';
  }

  async findAll() {
    let data = await this.prisma.datPhong.findMany()

    return data;
  }

  async findOne(id: number) {
    let data = await this.prisma.datPhong.findFirst({
      where:{
        id
      }
    })

    if(data){
      return data
    }else{
      throw new NotFoundException("không tìm thấy phòng đặt")
    }
  }

  async findByUser(id: number){
    let data = await this.prisma.datPhong.findMany({
      where:{
        ma_nguoi_dat: id
      }
    })

    if(data){
      return data
    }else{
      throw new NotFoundException("không tìm thấy phòng đặt")
    }
  }

  async update(id: number, updateDatPhongDto: UpdateDatPhongDto) {
    let { ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat } = updateDatPhongDto;

    await this.prisma.datPhong.update({
      where:{
        id
      },
      data:{
        ma_phong,
        ngay_den,
        ngay_di,
        so_luong_khach,
        ma_nguoi_dat
      }
    })

    return 'cập nhật  thành công';
  }

  async remove(id: number) {
    let data = await this.prisma.datPhong.findFirst({
      where:{
        id
      }
    })

    if(data){
      await this.prisma.datPhong.delete({
        where:{
          id
        }
      })
  
      return "đã xóa thành công"
    }else{
      throw new NotFoundException("Không tìm thấy hoặc đã xoá")
    }

   
  }
}
