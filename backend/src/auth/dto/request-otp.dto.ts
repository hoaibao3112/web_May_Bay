import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestOtpDto {
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;
}
