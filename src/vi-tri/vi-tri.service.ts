import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateViTriDto } from './dto/create-vi-tri.dto';
import { UpdateViTriDto } from './dto/update-vi-tri.dto';
import { PrismaClient, nguoiDung, viTri } from '@prisma/client';
import * as fs from "fs";

@Injectable()
export class ViTriService {
  private prisma = new PrismaClient()

  async create(createViTriDto: CreateViTriDto) {
    let {ten_vi_tri, quoc_gia, tinh_thanh} = createViTriDto;
    let checkName = await this.prisma.viTri.findFirst({
      where:{
        ten_vi_tri,
        is_delete: null
      }
    })

    if(checkName){
      throw new HttpException("Vị trí đã tạo", HttpStatus.FORBIDDEN)
    }else{
      await this.prisma.viTri.create({
        data:{
          ten_vi_tri,
          quoc_gia,
          tinh_thanh,
          is_delete: null,
        }
      });

      return "tạo thành công"
    }

  }

  async findAll(): Promise<viTri[]> {
    let data = await this.prisma.viTri.findMany({
      where:{
        is_delete: null
      }
    })

    return data;
  }

  async findOne(id: number) {
    let data = await this.prisma.viTri.findFirst({
      where:{
        id,
        is_delete: null
      }
    })

    if(data){
      return data
    }else{
      throw new NotFoundException("không tìm thấy người dùng")
    }      
  }

  async update(id: number, updateViTriDto: UpdateViTriDto) {
    let data = await this.prisma.viTri.findFirst({
      where:{
        id,
        is_delete: null
      }
    })
    
    if(data){
      let {ten_vi_tri, tinh_thanh, quoc_gia} = updateViTriDto
      await this.prisma.viTri.update({
        where:{
          id
        },
        data:{
          ten_vi_tri,tinh_thanh,quoc_gia
        }
      })
      return "cập nhật thành công" 
    }else{
      throw new NotFoundException("Vị trí không tồn tại")
    }
  }

   async remove(id: number) {
    let data = await this.prisma.viTri.findFirst({
      where:{
        id,
        is_delete: null
      }
    })
    if(data){

      await this.prisma.viTri.update({
        where:{
          id
        },
        data:{
          is_delete: true
        }
      })
      return "Xóa thành công" 
    }else{
      throw new NotFoundException("Vị trí không tồn tại hoặc đã xóa")
    }

  }

  async findByPages(pageIndex: number, pageSize: number, keyWord: string){
    let index = (pageIndex -1)*pageSize;
    let data = await this.prisma.viTri.findMany({
      skip: index,
      take: pageSize,
      where:{
        ten_vi_tri: {
          contains: keyWord,
        },
        is_delete: null
      }
    })
    return data;
  }

  async updateImage(user: nguoiDung, file: Express.Multer.File, id: number){
    if(user.role == "User"){
      throw new UnauthorizedException("Bạn không có quyền")
    }


    let viTri = await this.prisma.viTri.findFirst({
      where:{
        id
      }
    })

    if(viTri.hinh_anh){
      let urlImage = process.cwd() + "/public/imgs/vi_tri/" + viTri.hinh_anh;

      fs.unlink(urlImage, (err) => {
        if(err) throw err
        console.log("đã xóa hình")
      })
    }

    viTri.hinh_anh = file.filename

    await this.prisma.viTri.update({
      where:{
        id,
      },
      data:{
        hinh_anh: viTri.hinh_anh
      }
    })

    return "cập nhật thành công"


  }
}
