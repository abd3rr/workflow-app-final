import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/loginResponse';

import { ApiService } from './api.service';
import { config } from '../config/config';
import { local } from 'd3-selection';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = config.loginUrl;
  accessToken: string | null = null;
  tokenType: string | null = null;
  isAuthenticated = false;
  userRole: string | null = null;
  currentUserId: any = null;
  currentUser: any = null;

  constructor(private http: HttpClient, private apiService: ApiService) {
    // Restore state from local storage
    this.isAuthenticated = !!localStorage.getItem('auth_token');
    this.userRole = localStorage.getItem('role');
    this.currentUserId = localStorage.getItem('user_id');
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(this.loginUrl, { email, password })
      .pipe(
        tap((response) => {
          if (response && response.accessToken) {
            localStorage.setItem('auth_token', response.accessToken);
            localStorage.setItem('user_id', String(response.userId));
            if (response.role) {
              localStorage.setItem('role', response.role);
              this.userRole = response.role;
            }

            this.isAuthenticated = true;
            this.currentUserId = String(response.userId);
          }
        }),
        switchMap((response) => {
          // Check if userId exists before passing it to getUserById
          if (response.userId) {
            return this.apiService.getUserById(response.userId);
          } else {
            // If userId doesn't exist, throw an error or handle the situation appropriately
            throw new Error('User ID is not available');
          }
        }),
        tap((user) => {
          // Store user data
          this.currentUser = user;
          localStorage.setItem('user', JSON.stringify(user));
        }),
        catchError((error) => {
          this.isAuthenticated = false;
          console.log('authentication failed : ', error);
          return throwError(error);
        })
      );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    this.isAuthenticated = false;
    this.userRole = null;
    this.currentUserId = null;
    this.currentUser = null;
  }
}
