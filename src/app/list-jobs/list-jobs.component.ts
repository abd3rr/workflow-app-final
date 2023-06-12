import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Job } from '../interfaces/job';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-list-jobs',
  templateUrl: './list-jobs.component.html',
  styleUrls: ['./list-jobs.component.css'],
})
export class ListJobsComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  searchControl = new FormControl('');

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllJobs().subscribe(
      (data) => {
        this.jobs = data;
        this.filteredJobs = this.jobs;
      },
      (error) => console.error(error)
    );

    this.searchControl.valueChanges.subscribe((searchTerm) =>
      this.search(searchTerm ?? '')
    );
  }

  search(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredJobs = this.jobs;
      return;
    }

    this.filteredJobs = this.jobs.filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  deleteJob(id: number | null): void {
    // Delete action will be implemented here
    console.log(`Delete job with ID: ${id}`);
  }

  updateJob(job: Job): void {
    // Update action will be implemented here
    console.log(`Update job: `, job);
  }
}
