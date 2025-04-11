import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserRegisterDto {
    @IsEmail()
    EMAIL: string;

    @IsNotEmpty()
    @Length(2, 50)
    NAME: string;
}