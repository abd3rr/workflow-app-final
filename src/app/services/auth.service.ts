import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  private users = [
    { username: 'user 1', password: '123456', role: 'user' },
    { username: 'user 2', password: '123456', role: 'user' },
    { username: 'admin', password: '123456', role: 'admin' },
  ];

  isAuthenticated = false;
  userRole: string | null = null;
  currentUser: any = null;

  login(username: string, password: string): boolean {
    const user = this.users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      this.isAuthenticated = true;
      this.userRole = user.role;
      this.currentUser = user;
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated = false;
    this.userRole = null;
    this.currentUser = null;
  }
}
