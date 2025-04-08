import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Potrzebne dla *ngIf
import { MatCardModule } from '@angular/material/card'; // Importuj moduł karty
import { CatImage } from '../../models/image.model'; // Importuj model

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule // Dodaj do importów
  ],
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css']
})
export class ImageCardComponent implements OnInit {
  @Input() imageData!: CatImage; // Odbieramy dane obrazka

  breedName: string = 'Unknown Breed';
  breedTemperament: string | null = null;

  ngOnInit(): void {
    // Bezpieczne pobranie danych rasy (API może zwrócić pustą tablicę breeds)
    if (this.imageData?.breeds?.length > 0) {
      this.breedName = this.imageData.breeds[0].name;
      this.breedTemperament = this.imageData.breeds[0].temperament;
    }
  }
}