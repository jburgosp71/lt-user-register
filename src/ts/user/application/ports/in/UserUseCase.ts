import { UserRegisterResponseDto } from '../../../interface/rest/dto/UserRegisterResponseDto';
import { UserRegisterDto } from '../../../interface/rest/dto/UserRegisterDto';

export interface RegisterUserUseCase {
    registerUser(dto: UserRegisterDto): Promise<UserRegisterResponseDto>;
}