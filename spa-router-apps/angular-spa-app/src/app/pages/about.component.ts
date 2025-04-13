import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-about',
  template: `
    <h2>O nas</h2>
    <ul>
      <li *ngFor="let person of team">{{ person }}</li>
    </ul>
  `,
  styles: [`
    ul {
    padding-left: 20px;
  }
  li {
    margin-bottom: 6px;
  }
    `]
})
export class AboutComponent {
  team = ['Anna', 'Jan', 'Piotr'];
}
