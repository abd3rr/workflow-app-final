import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Phase } from '../interfaces/phase';
import { Project } from '../interfaces/project';
import { Step } from '../interfaces/step';
import { ApiService } from '../services/api.service';
import { catchError, forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-step',
  templateUrl: './add-step.component.html',
  styleUrls: ['./add-step.component.css'],
})
export class AddStepComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}
  projectVals!: Project;
  projectId!: string;
  phaseList: Phase[] = []; // retrieved from add-phase
  stepList: Step[] = [];
  observablesOfPhases = [];

  stepForm = new FormGroup({
    phase: new FormControl(null, [Validators.required]),
    stepName: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    newPhase: new FormControl({}, [Validators.required]),
    newStepName: new FormControl('', [Validators.required]),
    newDescription: new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
    const encodedProjectVals = this.route.snapshot.paramMap.get('projectVals');
    const encodedPhaseVals = this.route.snapshot.paramMap.get('phaseList');
    this.projectVals =
      encodedProjectVals !== null
        ? JSON.parse(decodeURIComponent(encodedProjectVals))
        : {};
    this.phaseList =
      encodedPhaseVals !== null
        ? JSON.parse(decodeURIComponent(encodedPhaseVals))
        : [];
  }

  saveStep() {
    const newStep: Step = {
      id: null,
      stepName: this.stepForm.get('stepName')?.value!,
      description: this.stepForm.get('description')?.value!,
      isExpanded: false,
    };
    const selectedPhase: Phase = this.stepForm.get('phase')?.value!;
    const phaseIndex = this.phaseList.findIndex(
      (phase) => phase === selectedPhase
    );
    this.phaseList[phaseIndex].steps.push(newStep);
    this.stepForm.reset({});
  }

  expandUpdate(phaseIndex: number, stepIndex: number) {
    this.phaseList[phaseIndex].steps[stepIndex].isExpanded =
      !this.phaseList[phaseIndex].steps[stepIndex].isExpanded;

    this.stepForm.patchValue({
      newPhase: this.phaseList[phaseIndex],
      newStepName: this.phaseList[phaseIndex].steps[stepIndex].stepName,
      newDescription: this.phaseList[phaseIndex].steps[stepIndex].description,
    });
  }
  updateStep(phaseIndex: number, stepIndex: number) {
    const newPhase: Phase = this.stepForm.get('newPhase')!.value as Phase; // selected phase
    const newStepName = this.stepForm.get('newStepName')!.value!;
    const newDescription = this.stepForm.get('newDescription')!.value!;

    if (newPhase.phaseName !== this.phaseList[phaseIndex].phaseName) {
      const newStep: Step = {
        id: null,
        stepName: newStepName,
        description: newDescription,
        isExpanded: false,
      };
      const newPhaseIndex = this.phaseList.findIndex(
        (phase) => phase === newPhase
      );
      this.phaseList[newPhaseIndex].steps.push(newStep);
      this.phaseList[phaseIndex].steps.splice(stepIndex, 1);
    } else {
      const currentStep = this.phaseList[phaseIndex].steps[stepIndex];
      currentStep.stepName = newStepName;
      currentStep.description = newDescription;
    }

    this.phaseList[phaseIndex].steps[stepIndex].isExpanded = false;
    this.stepForm.reset({});
  }
  deleteStep(phaseIndex: number, stepIndex: number) {
    if (confirm('Are you sure to delete ')) {
      this.phaseList[phaseIndex].steps.splice(stepIndex, 1);
    }
  }

  // onSubmit() {

  //   this.createProject();
  // }
  onSubmit() {
    const projectName = this.projectVals.projectName;
    const description = this.projectVals.description;
    this.apiService.createProject(projectName, description).subscribe(
      (projectResponse) => {
        const projectId = projectResponse.id;
        for (let phase of this.phaseList) {
          const phaseName = phase.phaseName;
          const phaseDescription = phase.description;
          this.apiService
            .createPhase(projectId, phaseName, phaseDescription)
            .subscribe(
              (phaseResponse) => {
                const phaseId = phaseResponse.id;
                for (let step of phase.steps) {
                  const stepName = step.stepName;
                  const stepDescription = step.description;
                  this.apiService
                    .createStep(phaseId, stepName, stepDescription)
                    .subscribe(
                      (stepResponse) => {
                        console.log(stepResponse);
                        const encodedPhaseList = encodeURIComponent(
                          JSON.stringify(this.phaseList)
                        );
                        const encodedProjectVals = encodeURIComponent(
                          JSON.stringify(this.projectVals)
                        );
                        this.router.navigate([
                          '/sucessProjectAdd',
                          encodedProjectVals,
                          encodedPhaseList,
                        ]);
                      },
                      (stepError) => {
                        console.error('Error creating step:', stepError);
                        this.deleteProject(projectId); // delete project if step creation fails
                        // display error message to the user
                      }
                    );
                }
              },
              (phaseError) => {
                console.error('Error creating phase:', phaseError);
                this.deleteProject(projectId); // delete project if phase creation fails
                // display error message to the user
              }
            );
        }
      },
      (projectError) => {
        console.error('Error creating project:', projectError);
        // display error message to the user
      }
    );
  }

  deleteProject(projectId: string) {
    this.apiService.deleteProject(projectId).subscribe(
      (deleteResponse) => {
        console.log('Project deleted successfully');
      },
      (deleteError) => {
        console.error('Error deleting project:', deleteError);
      }
    );
  }
}
