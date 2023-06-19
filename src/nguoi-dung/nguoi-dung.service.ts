import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException  } from '@nestjs/common';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { PrismaClient, nguoiDung } from '@prisma/client';
import * as fs from "fs"

@Injectable()
export class NguoiDungService {
  private prisma = new PrismaClient();

  async create(createNguoiDungDto: CreateNguoiDungDto): Promise<HttpException> {
    try {
      let { name, email, pass_word, phone, birth_day, gender, role } = createNguoiDungDto;

      let data: CreateNguoiDungDto = {
        name, email, pass_word, phone, birth_day, gender, role
      }

      let checkEmail = await this.prisma.nguoiDung.findFirst({
        where: {
          email: email,
          is_delete: null,
        }
      })

      if (checkEmail) {
        return new HttpException("Email đã tồn tại", HttpStatus.CONFLICT)
      } else {
        await this.prisma.nguoiDung.create({ data })
        return new HttpException("tạo thành công", HttpStatus.CREATED);
      }
    } catch (err) {
      return new InternalServerErrorException("lỗi BE")
    }
  }

  async findAll(): Promise<nguoiDung[]> {
  

    let data: nguoiDung[] = await this.prisma.nguoiDung.findMany({
      where:{
        is_delete:null
      }
    })
    return data;
  }

  async findOne(id: number): Promise<nguoiDung> {

      let data: nguoiDung = await this.prisma.nguoiDung.findFirst({
        where: {
          id,
          is_delete: null,
        }
      })
      if (data) {
        return data;
      } else {
        throw new NotFoundException("Không tìm thấy người dùng")
      }

  }

  async update(id: number, updateNguoiDungDto: UpdateNguoiDungDto) {
      let { name, email, pass_word, phone, birth_day, gender, role } = updateNguoiDungDto;

      let data = await this.prisma.nguoiDung.findFirst({
        where: {
          id,
          is_delete: null,
        }
      })

      let newData: UpdateNguoiDungDto = {
        name,
        email,
        pass_word,
        phone,
        birth_day,
        gender,
        role,
      }

      if (!data) {
        throw new NotFoundException("khong tìm thấy người dùng")
      } else {
        console.log(1)

        await this.prisma.nguoiDung.update({
          where: {
            id,
          },
          data: newData
        })

        return "đã cập nhật";
      }



  }

  async findSearch(search: string): Promise<nguoiDung[]> {
    let data = await this.prisma.nguoiDung.findMany({
      where: {
        name: {
          contains: search
        },
        is_delete: null,
      }
    })

    if (data.length !== 0) {
      return data
    } else {
      throw new NotFoundException("không tìm thấy người dùng")
    }

  }

  async findByPages(pageIndex: number, pageSize: number, keyWord: string): Promise<nguoiDung[]> {
    let index = (pageIndex - 1) * pageSize;
    let data = await this.prisma.nguoiDung.findMany({
      skip: index,
      take: pageSize,
      where: {
        name: {
          contains: keyWord,
        },
        is_delete: null
      }
    })
    return data
  }


  async remove(id: number) {
    let data = await this.prisma.nguoiDung.findFirst({
      where:{
        id,
        is_delete: null
      }
    });

    if(data){
      await this.prisma.nguoiDung.update({
        where:{
          id
        },
        data:{
          is_delete: null,
        }
      });
      throw new HttpException("đã xóa thành công", HttpStatus.OK)
    }else{
      throw new NotFoundException("không tìm thấy người dùng")
    }
  }

  async updateAvatar(user: nguoiDung, file: Express.Multer.File){
    if(user.avatar){
      let urlImage = process.cwd() + "/public/imgs/nguoi_dung/" + user.avatar;

      fs.unlink(urlImage, (err) => {
        if(err) throw err
        console.log("đã xóa hình")
      })
    }

    user.avatar = file.filename;

    await this.prisma.nguoiDung.update({
      where:{
        id: user.id
      },
      data:{
        avatar: user.avatar
      }
    })

    return "cập nhật thành công"

  }
}
