// src/app/services/cat-api.service.ts (fragment)

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CatImage , FavouriteResponse, FavouriteInfo} from '../models/image.model'; // Zaimportuj model

@Injectable({ providedIn: 'root' })
export class CatApiService {
  private apiUrl = 'https://api.thecatapi.com/v1';
  private apiKey = environment.catApiKey;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'x-api-key': this.apiKey });
  }

  // Nagłówki są potrzebne dla wszystkich zapytań modyfikujących
  private postDeleteHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json', // Ważne dla POST
      'x-api-key': this.apiKey
    });
  }

  getRandomImages(limit: number = 12): Observable<CatImage[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('has_breeds', '1');
    const headers = this.getHeaders();
    // Ważne: dodajemy typ zwracany Observable<CatImage[]>
    return this.http.get<CatImage[]>(`${this.apiUrl}/images/search`, { headers, params });
  }

  // ... inne metody (getFavourites, addFavourite, removeFavourite) dodamy później ...

  // --- NOWE METODY ---

  /** Dodaje obrazek do ulubionych */
  addFavourite(imageId: string): Observable<FavouriteInfo> {
    const headers = this.postDeleteHeaders();
    const body = { image_id: imageId };
    // API zwraca obiekt z ID nowego ulubionego i wiadomością
    return this.http.post<FavouriteInfo>(`${this.apiUrl}/favourites`, body, { headers });
}

/** Usuwa obrazek z ulubionych na podstawie ID ulubionego */
removeFavourite(favouriteId: number | string ): Observable<any> { // API zwraca prosty obiekt { message: 'SUCCESS' }
    const headers = this.postDeleteHeaders();
    // W metodzie DELETE nie wysyłamy body w ten sposób, tylko ID w URL
    // --- POPRAWIONA LINIA URL ---
  // Używamy backticków (`) do interpolacji stringu
  const url = `${this.apiUrl}/favourites/${favouriteId}`;
  // -----------------------------

  // Opcjonalnie: Dodaj log, aby sprawdzić URL przed wysłaniem
  console.log(`CatApiService: Attempting DELETE request to URL: ${url}`);

  // Użyj poprawnego url w metodzie delete
  return this.http.delete(url, { headers });
}

// Metoda getFavourites() będzie potrzebna później dla FavouritesFeedComponent
getFavourites(): Observable<FavouriteResponse[]> {
    const headers = new HttpHeaders({ 'x-api-key': this.apiKey });
    const params = new HttpParams().set('order', 'DESC');
    return this.http.get<FavouriteResponse[]>(`${this.apiUrl}/favourites`, { headers, params });
}
// --- KONIEC NOWYCH METOD ---
  
// --- NOWA METODA ---
  /** Pobiera szczegóły pojedynczego obrazka po jego ID */
  getImageById(imageId: string): Observable<CatImage> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/images/${imageId}`;
    console.log(`CatApiService: Getting image details from: ${url}`); // Log dla debugowania
    return this.http.get<CatImage>(url, { headers });
  }
  // --- KONIEC NOWEJ METODY ---

}