import { ApiProperty } from "@nestjs/swagger"


export class CreateNguoiDungDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    pass_word: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    birth_day: string;
    @ApiProperty()
    gender: boolean;
    @ApiProperty()
    role: string;
}
