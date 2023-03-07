import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent {
  constructor(private router: Router) {}
  projectForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  onSubmit() {
    const projectVals = this.projectForm.value;
    const encodedProjectVals = encodeURIComponent(JSON.stringify(projectVals));
    this.router.navigate(['/addPhase', encodedProjectVals]);
  }
}
