import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    console.log('🚀 App running at http://localhost:3000');
}

bootstrap();
