import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enabled CORS
  app.enableCors();
  app.use(express.static("."));

  const config = new DocumentBuilder().setTitle("Swagger NestJs").setVersion("").setDescription("Airbnb").addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/swagger", app, document); // => localhost:8080/swagger

  await app.listen(8080);


}
bootstrap();
