import { Component } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {
  user = { name: 'Jan', age: 25 };

  updateAge() {
    this.user.age++;
  }
}
