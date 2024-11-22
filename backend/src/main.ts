import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieparser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cookieparser());
  app.use(compression());

  const configService = app.get(ConfigService);
  const appConfig = configService.get('app_config');

  app.enableCors({
    origin: [appConfig.FRONTEND_URL],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Inventory')
    .setDescription('This is an inventory for Fatema steel')
    .setVersion('1.0')
    .addTag('inventory')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(appConfig.BACKEND_PORT);
}
bootstrap();
