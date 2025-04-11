import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY, MAIL_SENDER } from '../constants/tokens';
import { RegisterUserUseCase } from '../ports/in/UserUseCase';
import { UserRegisterDto } from '../../interface/rest/dto/UserRegisterDto';
import { UserRegisterResponseDto } from '../../interface/rest/dto/UserRegisterResponseDto';
import { UserRepositoryPort } from '../ports/out/UserRepositoryPort';
import { MailSenderPort } from '../ports/out/MailSenderPort';
import { DbException } from '../exceptions/DbException';
import { MailException} from "../exceptions/MailException";

@Injectable()
export class UserService implements RegisterUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
        @Inject(MAIL_SENDER) private readonly mailSender: MailSenderPort,
    ) {}

    async registerUser(dto: UserRegisterDto): Promise<UserRegisterResponseDto> {
        let user
        try {
            const existing = await this.userRepo.findByEmail(dto.EMAIL);
            if (existing) {
                return {
                    id: existing.id,
                    message: 'User already exists',
                    createdAt: existing.createdAt,
                };
            }

            user = await this.userRepo.createUser(dto.NAME, dto.EMAIL);

            /*try {
                await this.mailSender.sendWelcomeEmail(user.email, user.name);
            } catch(mailError) {
                throw new MailException('Failed to send welcome email');
            }

            return {
                id: user.id,
                message: 'User registered successfully',
                createdAt: user.createdAt,
            };*/

        } catch (dbError) {
            throw new DbException('Database operation failed');
        }

        try {
            await this.mailSender.sendWelcomeEmail(user.email, user.name);
        } catch(mailError) {
            throw new MailException('Failed to send welcome email');
        }

        return {
            id: user.id,
            message: 'User registered successfully',
            createdAt: user.createdAt,
        };
    }
}
