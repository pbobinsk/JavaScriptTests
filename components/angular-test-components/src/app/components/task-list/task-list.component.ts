import { Component } from '@angular/core';

import { CommonModule } from '@angular/common'; // ✅ Importujemy CommonModule

@Component({
  selector: 'app-task-list',
  standalone: true, // ✅ Jeśli używasz Angular 15+
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule] // ✅ To pozwala używać *ngFor
})

export class TaskListComponent {
  tasks: string[] = ['Kup mleko', 'Zrób obiad'];

  addTask() {
    this.tasks.push(`Nowe zadanie ${this.tasks.length + 1}`);
  }
}
