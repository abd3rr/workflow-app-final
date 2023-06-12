import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'],
})
export class ListUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchControl = new FormControl('');

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.filteredUsers = this.users;
      },
      (error) => console.error(error)
    );

    this.searchControl.valueChanges.subscribe((searchTerm) =>
      this.search(searchTerm ?? '')
    );
  }

  search(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  goToUserDetail(user: User): void {
    this.router.navigate(['/userDetailAdmin', user.id]);
  }
  deleteUser(user: User): void {
    console.log(`Delete user: `, user);
  }

  updateUser(user: User): void {
    console.log(`Update user: `, user);
  }
}
