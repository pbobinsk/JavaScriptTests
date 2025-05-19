import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsInt()
  @Min(1)
  readonly quantity: number;
}