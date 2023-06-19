import { PartialType } from '@nestjs/mapped-types';
import { CreateBinhLuanDto } from './create-binh-luan.dto';
import { ApiProperty } from "@nestjs/swagger"
export class UpdateBinhLuanDto extends PartialType(CreateBinhLuanDto) {
    @ApiProperty()
    ma_phong: number;
    @ApiProperty()
    ma_nguoi_binh_luan: number;
    @ApiProperty()
    ngay_binh_luan: string;
    @ApiProperty()
    noi_dung: string;
    @ApiProperty()
    sao_binh_luan: number
}
