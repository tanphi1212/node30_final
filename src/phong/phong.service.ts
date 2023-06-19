import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import { PrismaClient, nguoiDung, phong } from '@prisma/client';
import * as fs from 'fs'
@Injectable()
export class PhongService {
  private prisma = new PrismaClient()

  async create(createPhongDto: CreatePhongDto) {
    let {
      ten_phong,
      phong_ngu,
      giuong,
      phong_tam,
      mo_ta,
      gia_tien,
      may_giat,
      ban_la,
      tivi,
      khach,
      dieu_hoa,
      wifi,
      bep,
      do_xe,
      ho_boi,
      ban_ui,
      ma_vi_tri
    } = createPhongDto
 

  let checkName = await this.prisma.phong.findFirst({
    where:{
      ten_phong,
      is_delete: null
    }
  })

  if(checkName){
    throw new ForbiddenException("tên bị trùng")
  }else{
    await this.prisma.phong.create({
      data : {
        ten_phong,
        phong_ngu,
        giuong,
        phong_tam,
        mo_ta,
        khach,
        gia_tien,
        may_giat,
        ban_la,
        tivi,
        dieu_hoa,
        wifi,
        bep,
        do_xe,
        ho_boi,
        ban_ui,
        ma_vi_tri
      } 
    });

    return "Tạo thành công"
  }
  }

  async findAll() : Promise<phong[]> {
    let data = await this.prisma.phong.findMany({
      where:{
        is_delete: null,
      }
    })
    return data;
  }

  async findOne(id: number) : Promise<phong> {

    let data = await this.prisma.phong.findFirst({
      where:{
        id,
        is_delete: null,
      }
    })

    if(data){
      return data;
    }else{
      throw new NotFoundException("Không tìm thấy phòng")
    }

  }

  async findByLocation(maViTri: number){
    let data = await this.prisma.phong.findMany({
      where:{
        ma_vi_tri: maViTri,
        is_delete: null
      }
    })

    if(data.length !== 0){
      return data;
    }else{
      throw new NotFoundException("Không tìm thấy phòng")
    }
  }

  async findByPages(pageIndex: number, pageSize: number, keyWord: string){
    let index = (pageIndex - 1) * pageSize;
    let data = await this.prisma.phong.findMany({
      skip: index,
      take: pageSize,
      where: {
        ten_phong: {
          contains: keyWord,
        },
        is_delete: null
      }
    })
    return data
  }


  async update(id: number, updatePhongDto: UpdatePhongDto) {
    let {
      ten_phong,
      phong_ngu,
      giuong,
      phong_tam,
      mo_ta,
      gia_tien,
      may_giat,
      ban_la,
      tivi,
      khach,
      dieu_hoa,
      wifi,
      bep,
      do_xe,
      ho_boi,
      ban_ui,
      ma_vi_tri
    } = updatePhongDto

    let data = await this.prisma.phong.findFirst({
      where:{
        id,
        is_delete: null
      }
    })

    if(!data){
      throw new NotFoundException("Không tìm thấy người dùng")
    }else{
      await this.prisma.phong.update({
        where:{
          id
        },
        data:{
          ten_phong,
          phong_ngu,
          giuong,
          phong_tam,
          mo_ta,
          gia_tien,
          may_giat,
          ban_la,
          tivi,
          khach,
          dieu_hoa,
          wifi,
          bep,
          do_xe,
          ho_boi,
          ban_ui,
          ma_vi_tri
        }
      })

      return "đã cập nhật thành công"
    }
  }

  async remove(id: number) {
    let data = await this.prisma.phong.findFirst({
      where:{
        id,
        is_delete: null
      }
    })

    if(data){
      await this.prisma.phong.update({
        where:{
          id
        },
        data:{
          is_delete: 1
        }
      })
      return "đã xóa thành công"
    }else{
      throw new NotFoundException("Không tìm thấy phòng hoặc phòng đã xóa")
    }
  } 

  async updateImage(user: nguoiDung, file: Express.Multer.File, id: number){
    if(user.role == "User"){
      throw new UnauthorizedException("Bạn không có quyền")
    }


    let phong = await this.prisma.phong.findFirst({
      where:{
        id
      }
    })

    if(phong.hinh_anh){
      let urlImage = process.cwd() + "/public/imgs/phong/" + phong.hinh_anh;

      fs.unlink(urlImage, (err) => {
        if(err) throw err
        console.log("đã xóa hình")
      })
    }

    phong.hinh_anh = file.filename

    await this.prisma.phong.update({
      where:{
        id,
      },
      data:{
        hinh_anh: phong.hinh_anh
      }
    })

    return "cập nhật thành công"


  }
}
