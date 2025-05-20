import { Controller, Get, Post, Body, Param, ParseIntPipe, UsePipes, ValidationPipe, Version } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './interfaces/item.interface';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items') // Prefix dla wszystkich tras w tym kontrolerze
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Version('1') 
  @Get()
  findAll(): Item[] {
    return this.itemsService.findAll();
  }

  @Version('1') 
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Item { // ParseIntPipe konwertuje i waliduje, że 'id' to liczba
    return this.itemsService.findOne(id);
  }

  @Version('1') 
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Włącza walidację DTO
  create(@Body() createItemDto: CreateItemDto): Item {
    return this.itemsService.create(createItemDto);
  }
  
  @Version('2')
  @Get()
  findAllV2(): object { // Zmieniamy strukturę odpowiedzi dla v2
    console.log('Handling GET /v2/items');
    const items = this.itemsService.findAll();
    return {
      apiVersion: 'v2.0',
      count: items.length,
      data: items.map(item => ({ ...item, name: `[V2] ${item.name}` })), // Zmodyfikowane dane
      message: 'Witaj w wersji 2 naszego API przedmiotów!',
    };
  }

  // Możesz też dodać inne endpointy dla v2, np. GET /v2/items/:id
  @Version('2')
  @Get(':id')
  findOneV2(@Param('id', ParseIntPipe) id: number): object {
    console.log(`Handling GET /v2/items/${id}`);
    try {
      const item = this.itemsService.findOne(id);
      return {
        apiVersion: 'v2.0',
        data: { ...item, name: `[V2] ${item.name}` },
      };
    } catch (error) {
      // Przekształć błąd NotFoundException w odpowiedni format dla v2
      if (error.status === 404) {
        return { apiVersion: 'v2.0', error: true, message: error.message, statusCode: 404 };
      }
      throw error; // Rzuć inne błędy dalej
    }
  }
}