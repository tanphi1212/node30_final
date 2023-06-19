import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLogin } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("auth")
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  
  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body() userLogin: UserLogin) {
    return this.authService.signIn(userLogin);
  }

  @Post('sign-up')
  @HttpCode(200)
  signUp(@Body() createAuthDto: CreateAuthDto ) {
    return this.authService.signUp(createAuthDto);
  }

}
