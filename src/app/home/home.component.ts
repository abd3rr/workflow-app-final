import { ChangeDetectorRef, Component } from '@angular/core';

import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  user: User | null = null;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null;
  }
}
