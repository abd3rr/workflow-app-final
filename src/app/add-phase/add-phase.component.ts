import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Phase } from '../interfaces/phase';
import { Project } from '../interfaces/project';

@Component({
  selector: 'app-add-phase',
  templateUrl: './add-phase.component.html',
  styleUrls: ['./add-phase.component.css'],
})
export class AddPhaseComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}
  //
  projectVals!: Project; //  project vals from add-project
  phaseList: Phase[] = [];

  phaseForm = new FormGroup({
    phaseName: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    newPhaseName: new FormControl('', [Validators.required]),
    newDescription: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    // getting data from add-project form
    const encodedProjectVals = this.route.snapshot.paramMap.get('projectVals');
    this.projectVals =
      encodedProjectVals !== null
        ? JSON.parse(decodeURIComponent(encodedProjectVals))
        : {};
  }
  savePhase() {
    const newPhase: Phase = {
      phaseName: this.phaseForm.get('phaseName')?.value!,
      description: this.phaseForm.get('description')?.value!,
      isExpanded: false,
      steps: [],
    };
    this.phaseList.push(newPhase);
    this.phaseForm.reset({});
  }
  expandUpdate(phase: Phase) {
    this.phaseForm.patchValue({
      newPhaseName: phase.phaseName,
      newDescription: phase.description,
    });
    phase.isExpanded = !phase.isExpanded;
  }
  updatePhase(phase: Phase) {
    phase.phaseName = this.phaseForm.get('newPhaseName')?.value!;
    phase.description = this.phaseForm.get('newDescription')?.value!;
    phase.isExpanded = false;
  }
  deletePhase(index: number) {
    if (confirm('Are you sure to delete ')) {
      this.phaseList.splice(index, 1);
    }
  }
  onSubmit() {
    const encodedPhaseList = encodeURIComponent(JSON.stringify(this.phaseList));
    const encodedProjectVals = encodeURIComponent(
      JSON.stringify(this.projectVals)
    );
    this.router.navigate(['/addStep', encodedProjectVals, encodedPhaseList]);
  }
}
