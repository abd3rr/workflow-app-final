import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Job } from '../interfaces/job';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { Role } from '../interfaces/role';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
  userForm!: FormGroup;
  jobs?: Job[];
  roles?: Role[];
  profilePicture!: File | null | undefined;
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roleName: ['', Validators.required],
      passwordHash: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      profilePictureId: [null, Validators.required],
      jobId: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      passwordLength: [8],
      useNumbers: [false],
      useUppercase: [false],
      useSpecialCharacters: [false],
    });
    this.getJobs();
    this.getRoles();
  }

  getJobs() {
    this.apiService.getAllJobs().subscribe(
      (jobs) => {
        this.jobs = jobs;
      },
      (error) => {
        console.log('Error fetching jobs:', error);
      }
    );
  }
  getRoles() {
    this.apiService.getAllRoles().subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => {
        console.log('Error fetching roles:', error);
      }
    );
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.profilePicture = file;
    }
  }

  generatePassword() {
    const passwordLength = this.passwordForm.get('passwordLength')?.value;
    const useNumbers = this.passwordForm.get('useNumbers')?.value;
    const useUppercase = this.passwordForm.get('useUppercase')?.value;
    const useSpecialCharacters = this.passwordForm.get(
      'useSpecialCharacters'
    )?.value;

    let characters = 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) {
      characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (useNumbers) {
      characters += '0123456789';
    }
    if (useSpecialCharacters) {
      characters += '!@#$%^&*()';
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    this.userForm.controls['passwordHash'].setValue(password);
  }

  onSubmit() {
    if (this.profilePicture) {
      this.apiService
        .createImageFile(this.profilePicture)
        .pipe(
          tap((response: HttpEvent<any>) => {
            if (response.type === HttpEventType.Response) {
              const user = this.userForm.value;
              user.profilePictureId = response.body?.id;
              console.log('User:', user);
              this.apiService.createUser(user).subscribe(
                (response) => {
                  console.log('User created successfully');
                  this.userForm.reset();
                  this.profilePicture = null;
                  this.snackBar.open('User created successfully', '', {
                    duration: 2000,
                  });
                },
                (error) => {
                  console.log('Error creating user:', error);
                }
              );
            }
          }),
          catchError((error) => {
            console.log('Error uploading profile picture:', error);
            return of(); // Don't retry if image upload fails
          })
        )
        .subscribe(); // Remember to unsubscribe in a real app
    }
  }
}
