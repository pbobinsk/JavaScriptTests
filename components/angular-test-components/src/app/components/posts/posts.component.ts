import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importujemy CommonModule

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  imports: [CommonModule] // ✅ To pozwala używać *ngFor
})
export class PostsComponent implements OnInit {
  posts: any[] = [];

  ngOnInit() {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(response => response.json())
      .then(data => this.posts = data);
  }
}
