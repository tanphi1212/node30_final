import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';
import { PrismaClient, nguoiDung } from '@prisma/client';

@Injectable()
export class BinhLuanService {

  private prisma = new PrismaClient();

  async create(createBinhLuanDto: CreateBinhLuanDto, user: nguoiDung) {
    let { ma_phong, ma_nguoi_binh_luan, ngay_binh_luan, noi_dung, sao_binh_luan } = createBinhLuanDto;
    

    if(user.id === ma_nguoi_binh_luan){
      await this.prisma.binhLuan.create({
        data:{
          ma_phong,
          ma_nguoi_binh_luan,
          ngay_binh_luan,
          noi_dung,
          sao_binh_luan
        }
      })
      return "đã tạo thành công"
    }else{
      throw new UnauthorizedException("Không đúng người")
    }
   
  }

  async findAll() {
    let data = await this.prisma.binhLuan.findMany({})

    return data;
  }

  async findByRoomId(id){
    let data = await this.prisma.binhLuan.findMany({
      where:{
        ma_phong: id
      }
    })

    if(data.length !== 0){
      return data
    }else{
      throw new NotFoundException("Không tìm thấy phòng")
    }

    
  }

  async findOne(id: number) {
    let data = await this.prisma.binhLuan.findFirst({
      where:{
        id
      }
    })

    if(data){
      
     return data;
    }else{
      throw new NotFoundException("Không tìm thấy bình luận")
    }

  }

  async update(id: number, updateBinhLuanDto: UpdateBinhLuanDto, user: nguoiDung) {
    let data = await this.prisma.binhLuan.findFirst({
      where:{
        id
      }
    })

    if(data){
      if(data.ma_nguoi_binh_luan === user.id){
        let { ma_nguoi_binh_luan,ma_phong,ngay_binh_luan,noi_dung,sao_binh_luan } = updateBinhLuanDto
        await this.prisma.binhLuan.update({
          where:{
            id
          },
          data:{
            ma_phong,
            ma_nguoi_binh_luan,
            ngay_binh_luan,
            noi_dung,
            sao_binh_luan
          }
        })
        return "cập nhật thành công"
      }else{
        throw new UnauthorizedException("bạn không có quyền")
      }
      
    }else{
      throw new NotFoundException("Không tìm thấy bình luận")
    }

   
  }

  async remove(id: number, user: nguoiDung) {
    let data = await this.prisma.binhLuan.findFirst({
      where:{
        id
      }
    })

    if(data){
      if(data.ma_nguoi_binh_luan === user.id){
        await this.prisma.binhLuan.delete({
          where:{
            id
          }
        })
        return "xóa thành công"
      }else{
        throw new UnauthorizedException("bạn không có quyền")
      }
      
    }else{
      throw new NotFoundException("Không tìm thấy bình luận")
    }
  }
}
