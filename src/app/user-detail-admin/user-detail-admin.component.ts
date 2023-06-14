import { Component } from '@angular/core';
import { User } from '../interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { Job } from '../interfaces/job';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-detail-admin',
  templateUrl: './user-detail-admin.component.html',
  styleUrls: ['./user-detail-admin.component.css'],
})
export class UserDetailAdminComponent {
  user!: User;
  userId: number | null = null;
  job!: Job;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId')) ?? null;
    this.apiService.getUserById(this.userId).subscribe(
      (user: User) => {
        this.user = user;
        this.fetchJob(user.jobId);
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  fetchJob(jobId: number | null): void {
    if (jobId) {
      this.apiService.getJobById(jobId).subscribe(
        (job: Job) => {
          this.job = job;
        },
        (error) => {
          console.error('Error fetching job:', error);
        }
      );
    }
  }
}
