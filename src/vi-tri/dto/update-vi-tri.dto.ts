import { PartialType } from '@nestjs/mapped-types';
import { CreateViTriDto } from './create-vi-tri.dto';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateViTriDto extends PartialType(CreateViTriDto) {
    @ApiProperty()
    ten_vi_tri: string;
    @ApiProperty()
    tinh_thanh: string;
    @ApiProperty()
    quoc_gia: string;
}
