import { Component, ViewChild } from '@angular/core';
import { Task, TaskStatus } from '../interfaces/task';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Phase } from '../interfaces/phase';
import { Project } from '../interfaces/project';
import { Step } from '../interfaces/step';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-task-list-user',
  templateUrl: './task-list-user.component.html',
  styleUrls: ['./task-list-user.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TaskListUserComponent {
  projectList!: Project[];
  phaseList!: Phase[] | null;
  stepList!: Step[];

  task: Task = {
    id: null,
    taskName: null,
    phaseName: 'test',
    phaseId: null,
    stepName: 'test',
    description: null,
    instructions: null,
    requiredVerification: null,
    stepId: null,
    fileIds: [],
    methodIds: [],
    assignedJobIds: [],
    assignedJobs: [],
    parentTaskIds: [null],
    childTaskIds: [null],
    status: 'PENDING',
    methodExecutions: [null],
    feedbacks: [null],
    createdAt: null,
    startedAt: null,
    finishedAt: null,
    isDisabled: false,
  };

  tasks: MatTableDataSource<Task> = new MatTableDataSource<Task>([this.task]);
  tasksWaitingForValidation: MatTableDataSource<Task> =
    new MatTableDataSource<Task>([this.task]);

  displayedColumnsValidation = [
    'taskName',
    'description',
    'createdAt',
    'startedAt',
  ];

  displayedColumnsTask = [
    'taskName',
    'description',
    'createdAt',
    'startedAt',
    'isDisabled',
  ];
  displayedColumnsTaskWithExpand = [...this.displayedColumnsTask, 'expand'];
  expandedElement?: Task | null = null;

  @ViewChild('sort1', { static: false }) sort1!: MatSort;
  @ViewChild('sort2', { static: false }) sort2!: MatSort;

  ngAfterViewInit() {
    this.setSorts();
  }

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

  setSorts() {
    if (this.sort1 && this.tasksWaitingForValidation) {
      this.tasksWaitingForValidation.sort = this.sort1;
    }

    if (this.sort2 && this.tasks) {
      this.tasks.sort = this.sort2;
    }
  }

  fetchUserTasks() {
    if (this.authService.currentUser) {
      this.apiService
        .getUserByName(this.authService.currentUser.username)
        .subscribe((user) => {
          this.apiService.getJobByUserId(user.id).subscribe((job) => {
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
                this.tasks = new MatTableDataSource(
                  tasks.map((task) => {
                    // find corresponding project, phase and step for each task
                    const project = this.findProjectByStepId(task.stepId);
                    const phase = project?.phases.find((phase) =>
                      phase.steps.some((step) => step.id === task.stepId)
                    );
                    const step = phase?.steps.find(
                      (step) => step.id === task.stepId
                    );

                    // link each task with the appropriate project, phase and step
                    task.projectName = project?.projectName;
                    task.phaseName = phase?.phaseName;
                    task.phaseId = phase?.id;
                    task.stepName = step?.stepName;

                    if (task.status === 'PENDING') {
                      return { ...task, isDisabled: true };
                    }
                    return task;
                  })
                );
                this.setSorts();
              });
          });
        });
    }
  }

  findProjectByStepId(stepId: number | null): Project | undefined {
    for (const project of this.projectList) {
      for (const phase of project.phases) {
        if (phase.steps.some((step) => step.id === stepId)) {
          return project;
        }
      }
    }
    return undefined;
  }

  fetchUserValidationTasks() {
    if (this.authService.currentUser) {
      this.apiService
        .getUserByName(this.authService.currentUser.username)
        .subscribe((user) => {
          this.apiService.getJobByUserId(user.id).subscribe((job) => {
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
                this.tasksWaitingForValidation = new MatTableDataSource(
                  tasksWaitingForValidation.map((task: Task) => {
                    // find corresponding project, phase and step for each task
                    const project = this.findProjectByStepId(task.stepId);
                    const phase = project?.phases.find((phase) =>
                      phase.steps.some((step) => step.id === task.stepId)
                    );
                    const step = phase?.steps.find(
                      (step) => step.id === task.stepId
                    );

                    // link each task with the appropriate project, phase and step
                    task.projectName = project?.projectName;
                    task.phaseName = phase?.phaseName;
                    task.phaseId = phase?.id;
                    task.stepName = step?.stepName;

                    return task;
                  })
                );
                this.setSorts();
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
