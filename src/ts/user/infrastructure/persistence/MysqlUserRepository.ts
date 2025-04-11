import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/UserEntity';
import { UserRepositoryPort } from '../../application/ports/out/UserRepositoryPort';

@Injectable()
export class MysqlUserRepository implements UserRepositoryPort {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { email } });
    }

    async createUser(name: string, email: string): Promise<User> {
        const user = this.userRepo.create({ name, email });
        return this.userRepo.save(user);
    }
}