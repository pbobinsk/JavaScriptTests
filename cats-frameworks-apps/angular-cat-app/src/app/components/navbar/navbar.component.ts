import { Component, Input, Output, EventEmitter } from '@angular/core';

// Importuj potrzebne moduły Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle'; // Importuj też typ MatSlideToggleChange

@Component({
  selector: 'app-navbar', // Nazwa znacznika HTML tego komponentu
  standalone: true, // Potwierdzenie, że jest standalone
  imports: [
    // Moduły potrzebne w szablonie tego komponentu
    MatToolbarModule,
    MatSlideToggleModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Odpowiednik propsa 'title' z Reacta
  @Input() title: string = 'Default Title'; // Możesz ustawić domyślny tytuł

  // Odpowiednik callbacka 'onModeChange' z Reacta
  // Emituje wartość boolean (true/false) gdy przełącznik się zmienia
  @Output() modeChange = new EventEmitter<boolean>();

  // Metoda wywoływana przy zmianie stanu przełącznika
  onToggleChange(event: MatSlideToggleChange): void {
    // Pobierz nową wartość (checked/unchecked) z obiektu zdarzenia
    const isChecked = event.checked;
    // Wyemituj zdarzenie 'modeChange' z nową wartością
    this.modeChange.emit(isChecked);
    console.log('Navbar mode changed:', isChecked); // Dla testów
  }
}