import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-contact',
  template: `
    <h2>Kontakt</h2>
    <form (ngSubmit)="submitForm()">
      <label>Imię: <input [(ngModel)]="name" name="name" required /></label>
      <label>Wiadomość: <textarea [(ngModel)]="message" name="message" required></textarea></label>
      <button type="submit">Wyślij</button>
    </form>
    <p *ngIf="submitted">Dziękujemy, {{ name }}!</p>
  `,
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name = '';
  message = '';
  submitted = false;

  submitForm() {
    this.submitted = true;
  }
}
