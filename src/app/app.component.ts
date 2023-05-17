import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'workflow-final-app-1.0';
  constructor(public authService: AuthService) {}
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }
}
