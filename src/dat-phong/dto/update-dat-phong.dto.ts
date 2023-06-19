import { PartialType } from '@nestjs/mapped-types';
import { CreateDatPhongDto } from './create-dat-phong.dto';
import { ApiProperty } from "@nestjs/swagger"
export class UpdateDatPhongDto extends PartialType(CreateDatPhongDto) {
    @ApiProperty()
    ma_phong: number;
    @ApiProperty()
    ngay_den: string;
    @ApiProperty()
    ngay_di: string;
    @ApiProperty()
    so_luong_khach: number;
    @ApiProperty()
    ma_nguoi_dat: number
}
