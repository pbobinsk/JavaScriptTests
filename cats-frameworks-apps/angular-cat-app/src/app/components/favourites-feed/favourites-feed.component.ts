// src/app/components/favourites-feed/favourites-feed.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
// Importuj więcej operatorów RxJS
import { finalize, map, switchMap, catchError } from 'rxjs/operators';
import { Observable, of, forkJoin, EMPTY } from 'rxjs'; // Dodaj of, forkJoin, EMPTY
import { tap } from 'rxjs/operators';

// Serwisy i Modele
import { CatApiService } from '../../services/cat-api.service';
import { CatImage, FavouriteResponse } from '../../models/image.model'; // Importuj oba modele

// Komponenty i Moduły UI
import { ImageCardComponent } from '../image-card/image-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-favourites-feed',
  standalone: true,
  imports: [
    CommonModule,
    ImageCardComponent, // Komponent karty
    MatProgressSpinnerModule // Spinner
  ],
  templateUrl: './favourites-feed.component.html',
  styleUrls: ['./favourites-feed.component.css']
})
export class FavouritesFeedComponent implements OnInit {
  // Zmienimy na Observable, aby potencjalnie użyć pipe async (choć zostaniemy przy subskrypcji dla jasności)
  // favouriteImages$: Observable<CatImage[]> = of([]); // Można tak, ale subskrypcja da lepszą kontrolę nad isLoading
 
  // Przechowujemy zmapowane dane gotowe dla ImageCardComponent
  favouriteImages: CatImage[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private catApiService: CatApiService) { }

  ngOnInit(): void {
    //this.loadFavourites();
    this.loadFavouritesWithDetails(); // Zmieniamy nazwę metody dla jasności
  }

  loadFavouritesWithDetails(): void {
    this.isLoading = true;
    this.error = null;
    this.favouriteImages = [];

    this.catApiService.getFavourites().pipe(
      // 1. Pobierz ulubione (FavouriteResponse[])
      tap(favs => console.log('Step 1: Got favourites list', favs)), // Log

      // 2. Przetwórz listę ulubionych. Jeśli pusta, zwróć pustą tablicę.
      //    W przeciwnym razie, dla każdego ulubionego, wywołaj getImageById.
      switchMap((favourites: FavouriteResponse[]) => {
        if (!favourites || favourites.length === 0) {
          console.log('Step 2: No favourites found, returning empty array.');
          return of([]); // Zwróć Observable emitujące pustą tablicę
        }
        console.log('Step 2: Favourites found, preparing to fetch details for IDs:', favourites.map(f => f.image_id));

        // Stwórz tablicę Observable dla zapytań o szczegóły obrazków
        const detailObservables: Observable<CatImage | null>[] = favourites.map(fav =>
          this.catApiService.getImageById(fav.image_id).pipe(
            catchError(err => {
              console.error(`Error fetching details for image ${fav.image_id}`, err);
              // Zwróć null lub pusty obiekt, aby forkJoin nie padł przez jeden błąd
              // Lub rzuć błąd dalej, jeśli chcesz przerwać cały proces
              return of(null); // Zwracamy null w razie błędu dla danego obrazka
            }),
            // Dodajmy favouriteId z powrotem do danych obrazka po pobraniu szczegółów
            map(imageDetails => {
                if (imageDetails) { // Sprawdź, czy nie było błędu (null)
                    imageDetails.favourite = { id: fav.id }; // Dodajemy ID ulubionego!
                }
                return imageDetails;
            })
          )
        );

        // 3. Użyj forkJoin, aby poczekać na wszystkie zapytania o szczegóły
        console.log('Step 3: Executing forkJoin for detail observables.');
        // forkJoin zwróci tablicę wyników (CatImage lub null) w tej samej kolejności
        return forkJoin(detailObservables);
      }),
      tap(results => console.log('Step 4: forkJoin completed', results)), // Log

      // 4. Przefiltruj wyniki, usuwając te, które zwróciły błąd (null)
      map((results: (CatImage | null)[]) =>
        results.filter((image): image is CatImage => image !== null) // Type guard
      ),
      tap(finalImages => console.log('Step 5: Filtered final images with details and favouriteId', finalImages)), // Log

      // Zawsze zakończ ładowanie
      finalize(() => this.isLoading = false)

    ).subscribe({
      next: (detailedImages: CatImage[]) => {
        this.favouriteImages = detailedImages;
      },
      error: (err: HttpErrorResponse) => {
        // Ten błąd będzie głównie z getFavourites(), jeśli getImageById mają catchError
        console.error('Error in loadFavouritesWithDetails stream:', err);
        this.error = 'Failed to load favourite details. Please try again later.';
      }
    });
  }

  loadFavourites(): void {
    this.isLoading = true;
    this.error = null;
    this.favouriteImages = []; // Czyścimy listę przed załadowaniem

    this.catApiService.getFavourites().pipe(
      // --- Kluczowe mapowanie danych ---
      map((favourites: FavouriteResponse[]) => {
        // Przekształcamy odpowiedź API (FavouriteResponse[])
        // na tablicę CatImage[], której oczekuje ImageCardComponent
        return favourites.map(fav => {
          const mappedImage: CatImage = {
            id: fav.image.id, // Używamy ID obrazka jako głównego ID
            url: fav.image.url,
            breeds: [], // Endpoint /favourites nie zwraca ras
            width: 0,   // Można by pobrać dodatkowo, ale pomijamy
            height: 0,  // Można by pobrać dodatkowo, ale pomijamy
            // WAŻNE: Przekazujemy ID ulubionego do ImageCardComponent!
            favourite: { id: fav.id }
          };
          return mappedImage;
        });
      }),
      // --- Koniec mapowania ---
      finalize(() => this.isLoading = false) // Zawsze zakończ ładowanie
    ).subscribe({
        next: (mappedImages) => {
          this.favouriteImages = mappedImages;
          console.log('Loaded and mapped favourites:', this.favouriteImages);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error loading favourites:', err);
          this.error = 'Failed to load favourites. Please try again later.';
        }
      });
  }

  /**
   * Metoda wywoływana, gdy ImageCardComponent wyemituje zdarzenie 'imageUnfavourited'.
   * Usuwa element z lokalnej listy, aby UI odświeżyło się natychmiast.
   * @param favouriteId ID ulubionego (przekazane z ImageCardComponent)
   */
  onImageUnfavourited(favouriteId: number | string): void {
    // Filtrujemy tablicę, zachowując tylko te elementy,
    // których ID ulubionego NIE pasuje do przekazanego ID.
    this.favouriteImages = this.favouriteImages.filter(img => img.favourite?.id !== favouriteId);
    console.log(`Removed favourite ${favouriteId} from the local FavouritesFeed list.`);
  }
}