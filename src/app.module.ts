import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViTriModule } from './vi-tri/vi-tri.module';
import { BinhLuanModule } from './binh-luan/binh-luan.module';
import { NguoiDungModule } from './nguoi-dung/nguoi-dung.module';
import { PhongModule } from './phong/phong.module';
import { DatPhongModule } from './dat-phong/dat-phong.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ViTriModule, BinhLuanModule, NguoiDungModule, PhongModule, DatPhongModule, AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({global: true})
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
