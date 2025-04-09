import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http'; // Do obsługi błędów HTTP
import { finalize } from 'rxjs/operators';

// Serwisy i Modele
import { CatApiService } from '../../services/cat-api.service';
import { CatImage, FavouriteInfo } from '../../models/image.model';

// Moduły Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; // Do przycisku
import { MatIconModule } from '@angular/material/icon';     // Do ikonki serca
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Do spinnera

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, // Dodaj do importów
    MatCardModule,
    MatButtonModule, // Dodaj do importów
    MatIconModule,   // Dodaj do importów
    MatProgressSpinnerModule // Dodaj do importów
  ],
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css']
})
export class ImageCardComponent implements OnInit {
  @Input() imageData!: CatImage; // Odbieramy dane obrazka

// Emituje ID ulubionego, gdy zostanie pomyślnie usunięty (dla FavouritesFeed)
@Output() imageUnfavourited = new EventEmitter<number | string>();

// Stan komponentu
isFavourite = false;
currentFavouriteId: number | string | null = null; // ID ulubionego z API
isProcessingFavourite = false; // Czy trwa zapytanie API?

  breedName: string = 'Unknown Breed';
  breedTemperament: string | null = null;

// Wstrzykujemy serwis API
constructor(private catApiService: CatApiService) {}

ngOnInit(): void {
  // Ustaw stan początkowy na podstawie danych wejściowych
  // (jeśli obrazek pochodzi z listy ulubionych, będzie miał już 'favourite')
  if (this.imageData?.favourite) {
    this.isFavourite = true;
    this.currentFavouriteId = this.imageData.favourite.id;
  } else {
    this.isFavourite = false;
    this.currentFavouriteId = null;
  }

  // Ustaw dane rasy
  if (this.imageData?.breeds?.length > 0) {
    this.breedName = this.imageData.breeds[0].name;
    this.breedTemperament = this.imageData.breeds[0].temperament;
  }
}

// Metoda wywoływana po kliknięciu przycisku serca
toggleFavourite(): void {
  // Ignoruj kliknięcia, jeśli już przetwarzamy zapytanie
  if (this.isProcessingFavourite) {
    return;
  }
  this.isProcessingFavourite = true; // Rozpocznij przetwarzanie

  if (this.isFavourite && this.currentFavouriteId !== null) {
    // --- AKCJA: Usuwanie z ulubionych ---
    console.log('Attempting to remove favourite with ID:', this.currentFavouriteId);
    this.catApiService.removeFavourite(this.currentFavouriteId).pipe(
      finalize(() => this.isProcessingFavourite = false) // Zawsze zakończ przetwarzanie
    ).subscribe({
        next: () => {
          console.log('Successfully unfavourited image:', this.imageData.id);
          this.isFavourite = false;
          // Wyemituj zdarzenie z ID usuniętego ulubionego
          this.imageUnfavourited.emit(this.currentFavouriteId!);
          this.currentFavouriteId = null;
          // Aktualizuj też dane wejściowe, aby były spójne (opcjonalne)
          if (this.imageData) this.imageData.favourite = null;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error unfavouriting image:', err);
          // Tutaj można dodać powiadomienie dla użytkownika
        }
      });

  } else {
    // --- AKCJA: Dodawanie do ulubionych ---
    console.log('Attempting to favourite image with ID:', this.imageData.id);
    this.catApiService.addFavourite(this.imageData.id).pipe(
      finalize(() => this.isProcessingFavourite = false) // Zawsze zakończ przetwarzanie
    ).subscribe({
        next: (newFavourite: FavouriteInfo) => {
          console.log('Successfully favourited image:', this.imageData.id, 'New Favourite Info:', newFavourite);
          this.isFavourite = true;
          this.currentFavouriteId = newFavourite.id; // Zapisz ID nowego ulubionego
           // Aktualizuj też dane wejściowe, aby były spójne (opcjonalne)
          if (this.imageData) this.imageData.favourite = { id: newFavourite.id };
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error favouriting image:', err);
          // Tutaj można dodać powiadomienie dla użytkownika
        }
      });
  }
}
}