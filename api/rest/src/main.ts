import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  // const corsOptions = {
  //   origin: 'http://localhost:3002', // replace with your frontend URL
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Accept, Authorization',
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  //   credentials: true,
  // };
  // app.enableCors({
  //   allowedHeaders: ['content-type', 'Accept', 'Authorization'],
  //   origin: 'http://localhost:3002',
  //   credentials: true,
  // });
  app.enableCors({
    origin: 'http://localhost:3002',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('TangoYankee')
    .setDescription('TangoYankee is a clothing brand in Bangladesh')
    .setVersion('0.1')
    .addTag('TangoYankee')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
