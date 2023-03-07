import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Phase } from '../interfaces/phase';
import { Project } from '../interfaces/project';
import { Step } from '../interfaces/Step';

@Component({
  selector: 'app-add-step',
  templateUrl: './add-step.component.html',
  styleUrls: ['./add-step.component.css'],
})
export class AddStepComponent {
  constructor(private route: ActivatedRoute) {}
  projectVals!: Project;
  phaseList: Phase[] = []; // retrieved from add-phase
  stepList: Step[] = [];

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
    //const phaseIndex = this.phaseList.findIndex(
    //   (phase) => phase === currentPhase
    // );
    // const stepIndex = this.phaseList[phaseIndex].steps.findIndex(
    //   (step) => step === selectedStep
    // );
    this.phaseList[phaseIndex].steps[stepIndex].isExpanded =
      !this.phaseList[phaseIndex].steps[stepIndex].isExpanded;

    this.stepForm.patchValue({
      newPhase: this.phaseList[phaseIndex],
      newStepName: this.phaseList[phaseIndex].steps[stepIndex].stepName,
      newDescription: this.phaseList[phaseIndex].steps[stepIndex].description,
    });
  }
  updateStep(phaseIndex: number, stepIndex: number) {
    // const phaseIndex = this.phaseList.findIndex(
    //   (phase) => phase === currentPhase
    // );
    // const stepIndex = this.phaseList[phaseIndex].steps.findIndex(
    //   (step) => step === selectedStep
    // );
    // this.phaseList[phaseIndex] =
    //   this.phaseList[phaseIndex].phaseName !==
    //   this.stepForm.get('newPhase')?.value
    //     ? selectedPhase
    //     : this.phaseList[phaseIndex];
    const newPhase: Phase = this.stepForm.get('newPhase')?.value as Phase; // selected phase
    // to do this part choose the new index push setps infos, delele the old one ; optimaly do changes only if phase onChange
    if (newPhase.phaseName !== this.phaseList[phaseIndex].phaseName) {
      const newStep: Step = {
        stepName: this.stepForm.get('newStepName')?.value!,
        description: this.stepForm.get('newDescription')?.value!,
        isExpanded: false,
      };
      const newPhaseIndex = this.phaseList.findIndex(
        (phase) => phase === newPhase
      );
      this.phaseList[newPhaseIndex].steps.push(newStep); //update the new Phase
      this.phaseList[phaseIndex].steps.splice(stepIndex, 1); // delete the step of the old phase
      this.phaseList[phaseIndex].steps[stepIndex].isExpanded = false;
      this.stepForm.reset({});
    } else {
      this.phaseList[phaseIndex].steps[stepIndex].stepName =
        this.stepForm.get('newStepName')?.value!;
      this.phaseList[phaseIndex].steps[stepIndex].description =
        this.stepForm.get('newDescription')?.value!;
      this.phaseList[phaseIndex].steps[stepIndex].isExpanded = false;

      this.stepForm.reset({});
    }
  }
  deleteStep(phaseIndex: number, stepIndex: number) {
    if (confirm('Are you sure to delete ')) {
      this.phaseList[phaseIndex].steps.splice(stepIndex, 1);
    }
  }
  onSubmit() {}
}
