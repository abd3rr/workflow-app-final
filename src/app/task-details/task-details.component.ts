import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Task } from '../interfaces/task';
import { ApiFile } from '../interfaces/apiFile';
import { Params } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { Step } from '../interfaces/step';
import { Method } from '../interfaces/method';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  private routeParamSubscription: Subscription | null = null;
  task!: Task | null;
  files: ApiFile[] = [];
  step!: Step | null;
  methods: Method[] = [];
  childTaskNames: Record<number, string> = {};
  parentTaskNames: Record<number, string> = {};

  goBack(): void {
    this.router.navigate(['/listTasks']);
  }

  ngOnInit(): void {
    this.routeParamSubscription = this.route.params.subscribe(
      (params: Params) => {
        const taskId = Number(params['taskId']);
        if (taskId && !isNaN(taskId)) {
          this.getTaskById(taskId);
        } else {
          console.error('Invalid task ID:', taskId);
        }
      }
    );
  }
  ngOnDestroy(): void {
    if (this.routeParamSubscription) {
      this.routeParamSubscription.unsubscribe();
    }
  }

  resetComponentState(): void {
    this.task = null;
    this.files = [];
    this.step = null;
    this.methods = [];
    this.childTaskNames = {};
    this.parentTaskNames = {};
  }
  getTaskById(taskId: number): void {
    this.resetComponentState();
    this.apiService.getTaskById(taskId).subscribe(
      (task: Task) => {
        this.task = task;
        this.fetchFiles(task.fileIds);
        this.fetchStep(task.stepId);
        this.fetchMethods(task.methodIds);
        this.fetchChildTaskNames(task.childTaskIds);
        this.fetchParentTaskNames(task.parentTaskIds);
      },
      (error) => {
        console.error('Error fetching task:', error);
      }
    );
  }
  fetchFiles(fileIds: number[]): void {
    for (const fileId of fileIds) {
      this.apiService.getFileById(fileId).subscribe(
        (file: ApiFile) => {
          this.files.push(file);
        },
        (error) => {
          console.error('Error fetching file:', error);
        }
      );
    }
  }

  fetchStep(stepId: number | null): void {
    if (stepId) {
      this.apiService.getStepById(stepId).subscribe(
        (step: Step) => {
          this.step = step;
        },
        (error) => {
          console.error('Error fetching step:', error);
        }
      );
    }
  }
  fetchMethods(methodIds: number[]): void {
    methodIds.forEach((methodId) => {
      this.apiService.getMethodById(methodId).subscribe(
        (method: Method) => {
          this.methods.push(method);
        },
        (error) => {
          console.error('Error fetching method:', error);
        }
      );
    });
  }

  fetchChildTaskNames(childTaskIds: (number | null)[]): void {
    childTaskIds.forEach((childTaskId) => {
      if (childTaskId !== null) {
        this.apiService.getTaskNameById(childTaskId).subscribe(
          (taskName: string) => {
            this.childTaskNames[childTaskId] = taskName;
            console.log('Fetched child task name:', childTaskId, taskName);
          },
          (error) => {
            console.error('Error fetching child task name:', error);
          }
        );
      }
    });
  }

  fetchParentTaskNames(parentTaskIds: (number | null)[]): void {
    parentTaskIds.forEach((parentTaskId) => {
      if (parentTaskId !== null) {
        this.apiService.getTaskNameById(parentTaskId).subscribe(
          (taskName: string) => {
            this.parentTaskNames[parentTaskId] = taskName;
            console.log('Fetched parent task name:', parentTaskId, taskName);
          },
          (error) => {
            console.error('Error fetching parent task name:', error);
          }
        );
      }
    });
  }

  downloadFile(fileId: number): void {
    this.apiService.downloadFile(fileId).subscribe(
      () => {
        console.log(`File ${fileId} downloaded successfully.`);
      },
      (error) => {
        console.error(`Error downloading file ${fileId}:`, error);
      }
    );
  }
}
