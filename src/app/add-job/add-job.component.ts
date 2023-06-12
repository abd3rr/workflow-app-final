import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css'],
})
export class AddJobComponent implements OnInit {
  jobForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.jobForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.jobForm.valid) {
      const job = { id: null, title: this.jobForm.value.title, usersId: [] };
      this.apiService.createJob(job).subscribe(
        (response) => {
          console.log('Job successfully created');
          this.jobForm.reset();
          this.snackBar.open('Job successfully created', '', {
            duration: 3000,
          });
        },
        (error) => {
          console.log('An error occurred:', error);
          this.snackBar.open('Failed to create job', '', {
            duration: 3000,
          });
        }
      );
    }
  }
}
