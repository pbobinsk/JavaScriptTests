import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  template: `
    <h2>Strona główna</h2>
    <p>Witamy w aplikacji Angular Standalone!</p>
    <button (click)="increment()">Kliknięto: {{ count }} razy</button>
  `,
  styles: [`
    button {
    padding: 8px 16px;
    background-color: #00c3ff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
  }
  button:hover {
    background-color: #00a5d3;
  }
    `]
})
export class HomeComponent {
  count = 0;

  increment() {
    this.count++;
  }
  
}
