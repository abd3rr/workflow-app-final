import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Project } from '../interfaces/project';
import { Phase } from '../interfaces/phase';
import { Step } from '../interfaces/step';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent {
  // TEST VARS
  projectList!: Project[];
  phaseList!: Phase[] | null;
  stepList!: Step[];

  userList = ['User 1 ', 'User 2', 'User 3 '];
  taskList = ['task 1', 'task 2 ', 'task 3 '];
  // ---------
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllProjects().subscribe(
      (projectsResponse) => {
        this.projectList = projectsResponse;
        console.log(this.projectList);
      },
      (error) => {
        console.error('Error getting the projects');
      }
    );
  }

  taskForm = new FormGroup({
    project: new FormControl({}, Validators.required),
    phase: new FormControl({}, Validators.required),
    step: new FormControl({}, Validators.required),
    taskName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    assignedUser: new FormControl(false, Validators.required),
    parentTask: new FormControl(false, Validators.required),
  });

  onSubmit() {}

  onProjectSelected() {
    const selectedProject = this.taskForm.get('project')?.value as Project;
    console.log('aaaaaaaaa');
    if (selectedProject && selectedProject.phases) {
      this.phaseList = selectedProject.phases;
      this.taskForm.patchValue({ phase: null, step: null });
    }
  }
  onPhaseSelected() {
    const selectedPhase = this.taskForm.get('phase')?.value as Phase;
    if (selectedPhase && selectedPhase.steps) {
      this.stepList = selectedPhase.steps;
    } else {
      this.taskForm.patchValue({ phase: null, step: null });
    }
  }
  onStepSelected() {}
  // onProjectChange() {
  //   const selectedProject = this.taskForm.value.project as Project | null;

  //   if (selectedProject && selectedProject.phases) {
  //     this.phaseList = selectedProject.phases;
  //   }
  // }
  // onPhaseChange() {
  //   const selectedPhase = this.taskForm.value.phase as Phase | null;
  //   if (selectedPhase && selectedPhase.id) {
  //     this.apiService.getStepsByPhaseId(selectedPhase.id).subscribe(
  //       (stepsResponse) => {
  //         this.stepList = stepsResponse as Step[];
  //       },
  //       (error) => {
  //         console.error('Error getting the steps');
  //       }
  //     );
  //   }
  // }
}
