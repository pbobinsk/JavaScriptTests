import { Component } from '@angular/core';
import { CounterComponent } from './components/counter/counter.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { PostsComponent } from './components/posts/posts.component';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Angular 14+ standalone mode
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CounterComponent, // ✅ Import komponentu
    TaskListComponent,
    UserInfoComponent,
    PostsComponent
  ]
})
export class AppComponent { }
