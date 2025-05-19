import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './interfaces/item.interface';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  private readonly items: Item[] = [
    { id: 1, name: 'Książka "NestJS od podstaw"', description: 'Podręcznik dla początkujących', quantity: 10 },
    { id: 2, name: 'Kubek Programisty', description: 'Idealny na poranną kawę', quantity: 25 },
  ];
  private nextId = 3;

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: number): Item {
    const item = this.items.find(item => item.id === id);
    if (!item) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }
    return item;
  }

  create(createItemDto: CreateItemDto): Item {
    const newItem: Item = {
      id: this.nextId++,
      ...createItemDto,
    };
    this.items.push(newItem);
    return newItem;
  }
}