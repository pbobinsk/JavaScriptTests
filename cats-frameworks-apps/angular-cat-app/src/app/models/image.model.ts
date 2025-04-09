// src/app/models/image.model.ts
export interface Breed {
    id: string;
    name: string;
    temperament: string;
    // inne pola...
  }
  
  export interface CatImage {
    id: string;
    url: string;
    breeds: Breed[];
    width: number;
    height: number;
    // W przyszłości dodamy tu info o ulubionych
    favourite?: { id: number | string } | null;
  }
  
  // Ten interfejs będzie potrzebny później dla ulubionych
  export interface FavouriteResponse {
      id: number; // lub string
      image_id: string;
      image: {
          id: string;
          url: string;
      }
      // inne pola...
  }

  export interface FavouriteInfo {
    id: number | string; // ID nowo utworzonego ulubionego
    message?: string; // API często zwraca komunikat SUCCESS
  }