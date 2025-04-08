import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule często jest potrzebny

// 1. Zaimportuj NavbarComponent
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent // 2. Dodaj NavbarComponent do imports
    // Tutaj dodasz inne komponenty, jak RandomFeedComponent, FavouritesFeedComponent później
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // 3. Właściwość do przekazania jako [title] do navbara
  appTitle = 'Angular Kitties - Standalone Navbar';
  currentModeIsFavourites = false; // Do śledzenia stanu

  // 4. Metoda do obsługi zdarzenia (modeChange) z navbara
  handleModeChange(isFavouritesMode: boolean): void {
    this.currentModeIsFavourites = isFavouritesMode;
    console.log('App component received mode change:', isFavouritesMode);
    // Tutaj później dodasz logikę przełączania widoków (np. *ngIf w szablonie)
  }
}