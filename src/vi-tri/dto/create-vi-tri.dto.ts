import { ApiProperty } from "@nestjs/swagger"

export class CreateViTriDto {
    @ApiProperty()
    ten_vi_tri: string;
    @ApiProperty()
    tinh_thanh: string;
    @ApiProperty()
    quoc_gia: string;
}
