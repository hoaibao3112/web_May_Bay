import { IsString, IsEmail } from 'class-validator';

export class AddContactDto {
  @IsString()
  hoTen: string;

  @IsEmail()
  email: string;

  @IsString()
  soDienThoai: string;
}
