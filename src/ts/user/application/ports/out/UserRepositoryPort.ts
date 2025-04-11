import { User } from '../../../domain/UserEntity';

export interface UserRepositoryPort {
    findByEmail(email: string): Promise<User | null>;
    createUser(name: string, email: string): Promise<User>;
}