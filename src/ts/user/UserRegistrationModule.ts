import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './interface/rest/UserController';
import { UserService } from './application/services/UserService';
import { User } from './domain/UserEntity';
import {USER_REPOSITORY, MAIL_SENDER, REGISTER_USER_USE_CASE } from './application/constants/tokens';
import { MysqlUserRepository } from './infrastructure/persistence/MysqlUserRepository';
import { NodemailerMailSender } from './infrastructure/email/NodemailerMailSender';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: USER_REPOSITORY,
            useClass: MysqlUserRepository,
        },
        {
            provide: MAIL_SENDER,
            useClass: NodemailerMailSender,
        },
        {
            provide: REGISTER_USER_USE_CASE,
            useExisting: UserService,
        },
    ],
})
export class UserRegistrationModule {}