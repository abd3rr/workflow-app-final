import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent {
  constructor(private router: Router) {}
  projectForm = new FormGroup({
    projectName: new FormControl('', [
      Validators.required,
      this.projectNameValidator,
    ]),
    description: new FormControl(''),
  });
  // Validators Functions

  projectNameValidator(control: FormControl) {
    if (!control.value) return { required: true };
    const pattern = /^[a-zA-Z][a-zA-Z0-9_ -]*$/;
    if (!pattern.test(control.value)) return { invalidNameOfProject: true };
    return null;
  }
  //-----
  onSubmit() {
    const projectVals = this.projectForm.value;
    const encodedProjectVals = encodeURIComponent(JSON.stringify(projectVals));
    this.router.navigate(['/addPhase', encodedProjectVals]);
  }
}
