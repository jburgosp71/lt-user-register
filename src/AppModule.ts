import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRegistrationModule } from './ts/user/UserRegistrationModule';
import { User } from './ts/user/domain/UserEntity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST || 'mysql',
            port: 3306,
            username: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'password',
            database: process.env.MYSQL_DATABASE || 'production_db',
            entities: [User],
            synchronize: true,
        }),
        UserRegistrationModule,
    ],
})
export class AppModule {}