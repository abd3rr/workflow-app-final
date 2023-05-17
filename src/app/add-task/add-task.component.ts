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
import { Task } from '../interfaces/task';
import { ApiService } from '../services/api.service';
import { Method } from '../interfaces/method';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  jobList!: Job[];
  taskList!: Task[];
  methodList!: Method[];
  actionList = ['Upload File'];
  selectedFile: File | null = null;
  // ---------
  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    forkJoin({
      projects: this.apiService.getAllProjects(),
      jobs: this.apiService.getAllJobs(),
      methods: this.apiService.getAllMethods(),
    }).subscribe(
      ({ projects, jobs, methods }) => {
        this.projectList = projects;
        console.log(this.projectList);

        this.jobList = jobs;
        console.log(this.jobList);

        this.methodList = methods;
        console.log(this.methodList);
      },
      (error) => {
        console.error('Error getting data:', error);
      }
    );
  }

  taskForm = new FormGroup({
    project: new FormControl({}, Validators.required),
    phase: new FormControl({}, Validators.required),
    step: new FormControl({}, Validators.required),
    taskName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    instructions: new FormControl('', Validators.required),
    assignedJobs: new FormControl([], Validators.required),
    parentTask: new FormControl([], Validators.required),
    file: new FormControl(null),
    requiredVerification: new FormControl(false),
    sendEmail: new FormControl(false),
  });

  onSubmit() {
    console.log(
      'Step form control value:',
      (this.taskForm.get('step')?.value as Step).id
    );

    const createTask = (fileId?: number) => {
      // Create the task object with all the necessary fields
      const task: Task = {
        id: 0,
        taskName: this.taskForm.get('taskName')?.value,
        description: this.taskForm.get('description')?.value,
        instructions: this.taskForm.get('instructions')?.value,
        requiredVerification: this.taskForm.get('requiredVerification')
          ?.value as boolean,

        stepId: (this.taskForm.get('step')?.value as Step).id,
        fileIds: fileId ? [fileId] : [],
        methodIds: [], // We will add the method IDs later
        assignedJobIds: [], // We will add the job IDs later
        parentTaskIds: (this.taskForm.get('parentTask')?.value as Task[] | null)
          ? (this.taskForm.get('parentTask')?.value as Task[])
              .filter((task: Task | undefined) => task !== undefined)
              .map((task: Task) => task.id)
          : [],

        childTaskIds: [], // We don't set the child tasks
        methodExecutions: [], // we don't set the methods execution
        status: 'PENDING',
      };

      // Add the assigned jobs to the task object
      const assignedJobs = this.taskForm.get('assignedJobs')?.value as Job[];
      task.assignedJobIds = assignedJobs
        .map((job: Job) => job.id)
        .filter((id): id is number => id !== null);

      // Check for each method in the methodList if there is a FormControl with a matching name
      this.methodList.forEach((method: Method) => {
        const methodControl = this.taskForm.get(method.methodName);
        if (methodControl && methodControl.value && method.id !== null) {
          task.methodIds.push(method.id);
        }
      });

      // Create the task using the ApiService
      this.apiService.createTask(task).subscribe(
        (taskResponse) => {
          console.log('Task created:', taskResponse);
          this.taskForm.get('taskName')?.reset();
          this.taskForm.get('description')?.reset();
          this.taskForm.get('assignedJobs')?.reset();
          this.taskForm.get('parentTask')?.reset();
          this.taskForm.get('file')?.reset();
          this.taskForm.get('requiredVerification')?.reset();
          this.methodList.forEach((method: Method) => {
            this.taskForm.get(method.methodName)?.reset();
          });
          this.selectedFile = null;
          this.snackBar.open('Task created successfully', 'Close', {
            duration: 5000,
          });
          // Refresh the list of tasks after creating a new task
          this.onStepSelected();
        },
        (error) => {
          console.log('Error creating task:', error);

          this.snackBar.open(
            'An error occurred while creating the task. Please try again later.',
            'Close',
            {
              duration: 5000,
            }
          );
        }
      );
    };

    // Handle file upload
    const fileControl = this.taskForm.get('file');
    // Handle file upload
    if (this.selectedFile) {
      this.apiService.createFile(this.selectedFile).subscribe(
        (fileResponse: any) => {
          console.log('File created:', fileResponse);
          if (fileResponse.body && fileResponse.body.id) {
            createTask(fileResponse.body.id);
          }
        },
        (error) => {
          console.log('Error creating file:', error);
          alert(
            'An error occurred while creating the file. Please try again later.'
          );
        }
      );
    } else {
      createTask();
    }
  }

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

  onStepSelected() {
    const selectedStep = this.taskForm.get('step')?.value as Step;
    if (selectedStep !== null) {
      this.apiService
        .getTasksByStepId(selectedStep.id)
        .subscribe((tasksResponse) => {
          this.taskList = tasksResponse;
        });
    }
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
      console.log('Selected file:', this.selectedFile);
    } else {
      this.selectedFile = null;
    }
  }
}
