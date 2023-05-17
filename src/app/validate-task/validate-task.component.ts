import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { Task } from '../interfaces/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validate-task',
  templateUrl: './validate-task.component.html',
  styleUrls: ['./validate-task.component.css'],
})
export class ValidateTaskComponent {
  tasksWaitingForValidation: Task[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserValidationTasks();
  }
  fetchUserValidationTasks() {}
  goToTaskDetail(taskId: number) {
    this.router.navigate(['/validateTaskDetails', taskId]);
  }
}
