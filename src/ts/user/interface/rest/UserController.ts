import {Body, Controller, Inject, Post} from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/ports/in/UserUseCase';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { UserRegisterResponseDto } from './dto/UserRegisterResponseDto';
import {REGISTER_USER_USE_CASE} from "../../application/constants/tokens";

@Controller('register')
export class UserController {
    constructor(
        @Inject(REGISTER_USER_USE_CASE) private readonly registerUser: RegisterUserUseCase,
    ) {}

    @Post()
    async register(@Body() body: UserRegisterDto): Promise<UserRegisterResponseDto> {
        return this.registerUser.registerUser(body);
    }
}
