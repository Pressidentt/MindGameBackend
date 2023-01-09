import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Mind Game Backend ')
    .setDescription('Documentation of REST API')
    .setVersion('1.0.0')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document)

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 5000

  await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}
bootstrap();
