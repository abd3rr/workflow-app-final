import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Project } from '../interfaces/project';
import { Phase } from '../interfaces/phase';
import { Step } from '../interfaces/step';
import { Job } from '../interfaces/job';
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
  actionsCounter: number = 1;
  jobList!: Job[];
  taskList = ['task 1', 'task 2 ', 'task 3 '];
  actionList = ['Upload File'];
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

    this.apiService.getAllJobs().subscribe((jobsResponse) => {
      this.jobList = jobsResponse;
      console.log(this.jobList);
    });
  }

  taskForm = new FormGroup({
    project: new FormControl({}, Validators.required),
    phase: new FormControl({}, Validators.required),
    step: new FormControl({}, Validators.required),
    taskName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    assignedJobs: new FormControl([], Validators.required),
    parentTask: new FormControl([], Validators.required),
    file: new FormControl('', Validators.required),
    shouldSendMail: new FormControl(false),
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
}
