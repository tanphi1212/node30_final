import { Injectable, NotFoundException, UnauthorizedException,ForbiddenException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserLogin } from './entities/auth.entity';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ){}


  private prisma = new PrismaClient()

  async signIn(userLogin: UserLogin) {
    let { email, pass_word } = userLogin
    let user = await this.prisma.nguoiDung.findFirst({
      where: {
        email,
        is_delete: null
      }
    })
    if(user){
      if (user.pass_word !== pass_word) {
        throw new UnauthorizedException("Mật khẩu không đúng")
      }
  
      user.pass_word = ""
  
      let token = this.jwtService.signAsync({data: user}, {expiresIn: "10m", secret: this.configService.get("SECRET_KEY")})
      return token
    }else{
      throw new NotFoundException("email không đúng")
    }

   
  }

  async signUp(createAuthDto: CreateAuthDto){
    let { name, email, pass_word, phone, birth_day, gender}  = createAuthDto;
    let checkEmail= await this.prisma.nguoiDung.findFirst({
      where:{
        email,
      }
    })

    if(!checkEmail){
      await this.prisma.nguoiDung.create({
        data:{
          name,
          email,
          pass_word,
          phone,
          birth_day,
          gender,
          role: "User",
        }
      })
      return "đã tạo thành công"
    }else{
      throw new ForbiddenException("Email đã tồn tại")
    }
  }


}
