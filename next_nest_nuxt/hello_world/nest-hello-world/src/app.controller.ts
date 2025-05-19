import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Domyślnie brak prefixu, lub np. @Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello') // Definiuje endpoint GET /hello
  getHello(): string {
    return this.appService.getHello();
  }
}