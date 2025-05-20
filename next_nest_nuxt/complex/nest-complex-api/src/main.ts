import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Włącz CORS
  app.enableCors({
    origin: true, // Możesz bardziej precyzyjnie określić origin, np. 'http://localhost:5500' (port Live Servera)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI, // np. /v1/items, /v2/items
  });

  // Globalny pipe dla walidacji DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Usuwa właściwości, które nie są zdefiniowane w DTO
    forbidNonWhitelisted: true, // Zgłasza błąd, jeśli są dodatkowe właściwości
    transform: true, // Automatycznie transformuje payload do instancji DTO
  }));

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
