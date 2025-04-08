import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Dla *ngIf, *ngFor, async pipe
import { finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs'; // Importuj Observable i of

// Serwisy i Modele
import { CatApiService } from '../../services/cat-api.service';
import { CatImage } from '../../models/image.model';

// Komponenty i Moduły UI
import { ImageCardComponent } from '../image-card/image-card.component'; // Importuj komponent karty
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Importuj spinner

@Component({
  selector: 'app-random-feed',
  standalone: true,
  imports: [
    CommonModule, // Niezbędne dla dyrektyw i pipe'ów
    ImageCardComponent, // Komponent karty
    MatProgressSpinnerModule // Moduł spinnera
  ],
  templateUrl: './random-feed.component.html',
  styleUrls: ['./random-feed.component.css']
})
export class RandomFeedComponent implements OnInit {
  // Zamiast subskrypcji ręcznej, użyjemy pipe'a 'async' w szablonie
  images$: Observable<CatImage[]> = of([]); // Inicjalizuj pustym strumieniem
  isLoading = false;
  error: string | null = null;

  constructor(private catApiService: CatApiService) { }

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.isLoading = true; // Ustaw ładowanie na true na początku
    this.error = null;    // Zresetuj błąd

    this.images$ = this.catApiService.getRandomImages().pipe(
      finalize(() => {
        this.isLoading = false; // Ustaw ładowanie na false po zakończeniu (sukces lub błąd)
        console.log('Loading finished'); // Debug log
      })
      // Obsługę błędów można dodać tutaj z operatorem catchError,
      // ale dla prostoty na razie zostawiamy - błąd przerwie strumień.
      // W bardziej rozbudowanej wersji można by zwrócić of([]) i ustawić error.
    );

    // Log do sprawdzenia, czy metoda została wywołana
    console.log('loadImages called, request initiated.');

    // Nie subskrybujemy się tutaj - robi to pipe 'async' w szablonie
  }
}