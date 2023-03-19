import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Phase } from '../interfaces/phase';
import { Project } from '../interfaces/project';

@Component({
  selector: 'app-success-create-project',
  templateUrl: './success-create-project.component.html',
  styleUrls: ['./success-create-project.component.css'],
})
export class SuccessCreateProjectComponent {
  constructor(private route: ActivatedRoute) {}

  projectVals!: Project;
  phaseList: Phase[] = []; // retrieved from add-steps

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
    console.log('Project VALS: ' + this.projectVals.projectName);
    for (let phase of this.phaseList) {
      console.log('PHASE TEST:' + phase.phaseName);
      for (let step of phase.steps) {
        console.log('STEP TEST : ' + step.stepName);
      }
    }
  }
}
