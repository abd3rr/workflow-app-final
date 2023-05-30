import { Component } from '@angular/core';
import { Task, TaskStatus } from '../interfaces/task';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Phase } from '../interfaces/phase';
import { Project } from '../interfaces/project';
import { Step } from '../interfaces/step';

@Component({
  selector: 'app-task-list-user',
  templateUrl: './task-list-user.component.html',
  styleUrls: ['./task-list-user.component.css'],
})
export class TaskListUserComponent {
  tasks: Task[] = [];
  projectList!: Project[];
  phaseList!: Phase[] | null;
  stepList!: Step[];
  tasksWaitingForValidation: Task[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  taskForm = new FormGroup({
    project: new FormControl(
      null,
      Validators.required
    ) as FormControl<Project | null>,
    phase: new FormControl(
      null,
      Validators.required
    ) as FormControl<Phase | null>,
    step: new FormControl(
      null,
      Validators.required
    ) as FormControl<Step | null>,
    showAllTasks: new FormControl(false),
  });

  ngOnInit() {
    this.getAllProjects();
    this.fetchUserTasks();
    this.fetchUserValidationTasks();
  }

  fetchUserTasks() {
    if (this.authService.currentUser) {
      this.apiService
        .getUserByName(this.authService.currentUser.username)
        .subscribe((user) => {
          console.log('User:', user); // Debug user data
          this.apiService.getJobByUserId(user.id).subscribe((job) => {
            console.log('Job:', job); // Debug job data

            const project = this.taskForm.get('project')?.value;
            const phase = this.taskForm.get('phase')?.value;
            const step = this.taskForm.get('step')?.value;
            const showAllTasks = this.taskForm.get('showAllTasks')?.value;

            let statusList: TaskStatus[] = ['STARTING'];
            if (showAllTasks) {
              statusList.push('PENDING');
            }

            this.apiService
              .getTasksByJobIdsStatusProjectPhaseStep(
                [job.id],
                statusList,
                project?.id ?? undefined,
                phase?.id ?? undefined,
                step?.id ?? undefined
              )
              .subscribe((tasks) => {
                console.log('Tasks:', tasks); // Debug tasks data
                this.tasks = tasks.map((task) => {
                  // If the task status is 'PENDING', set isDisabled to true
                  if (task.status === 'PENDING') {
                    return { ...task, isDisabled: true };
                  }
                  // Otherwise, return the task as is
                  return task;
                });
              });
          });
        });
    }
  }

  fetchUserValidationTasks() {
    if (this.authService.currentUser) {
      this.apiService
        .getUserByName(this.authService.currentUser.username)
        .subscribe((user) => {
          console.log('User:', user); // Debug user data
          this.apiService.getJobByUserId(user.id).subscribe((job) => {
            console.log('Job:', job); // Debug job data
            const project = this.taskForm.get('project')?.value;
            const phase = this.taskForm.get('phase')?.value;
            const step = this.taskForm.get('step')?.value;

            this.apiService
              .getTasksWaitingForValidationByJobIdAndProjectPhaseStep(
                job.id,
                project?.id ?? undefined,
                phase?.id ?? undefined,
                step?.id ?? undefined
              )
              .subscribe((tasksWaitingForValidation) => {
                console.log('Tasks:', tasksWaitingForValidation); // Debug tasks data
                this.tasksWaitingForValidation = tasksWaitingForValidation;
              });
          });
        });
    }
  }

  getAllProjects(): void {
    this.apiService.getAllProjects().subscribe(
      (projects: Project[]) => {
        this.projectList = projects;
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }
  onProjectSelected() {
    const selectedProject = this.taskForm.get('project')?.value as Project;
    if (selectedProject && selectedProject.phases) {
      this.phaseList = selectedProject.phases;
    } else {
      this.phaseList = null;
      this.taskForm.get('phase')?.setValue(null); // Reset the 'phase' form control to null.
    }
    this.stepList = []; // Reset the stepList when a new project is selected.
    this.taskForm.get('step')?.setValue(null); // Reset the 'step' form control to null.
    this.fetchUserTasks();
    this.fetchUserValidationTasks();
  }

  onPhaseSelected() {
    const selectedPhase = this.taskForm.get('phase')?.value as Phase;
    if (selectedPhase && selectedPhase.steps) {
      this.stepList = selectedPhase.steps;
    } else {
      this.stepList = [];
      this.taskForm.get('step')?.setValue(null); // Reset the 'step' form control to null.
    }
    this.fetchUserTasks();
    this.fetchUserValidationTasks();
  }

  onStepSelected() {
    this.fetchUserTasks();
    this.fetchUserValidationTasks();
  }

  onShowAllTasksChange(event: any) {
    this.fetchUserTasks();
    this.fetchUserValidationTasks();
  }

  resetFilters() {
    this.taskForm.get('project')?.setValue(null);
    this.taskForm.get('phase')?.setValue(null);
    this.taskForm.get('step')?.setValue(null);
    this.fetchUserTasks();
    this.fetchUserValidationTasks();
  }

  goToTaskDetail(taskId: number) {
    this.router.navigate(['/taskDetailUser', taskId]);
  }
  goToVerificationDetail(taskId: number) {
    this.router.navigate(['/validateTaskDetails', taskId]);
  }
}
