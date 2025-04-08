// src/app/services/cat-api.service.ts (fragment)

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CatImage } from '../models/image.model'; // Zaimportuj model

@Injectable({ providedIn: 'root' })
export class CatApiService {
  private apiUrl = 'https://api.thecatapi.com/v1';
  private apiKey = environment.catApiKey;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'x-api-key': this.apiKey });
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
  
}