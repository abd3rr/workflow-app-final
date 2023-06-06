import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Method } from '../interfaces/method';
import { Step } from '../interfaces/step';
import { Task } from '../interfaces/task';
import { ApiFile } from '../interfaces/apiFile';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';
import { MethodExecution } from '../interfaces/methodExecution';
import { userParameter } from '../interfaces/userParameter';
import { User } from '../interfaces/user';
import { Job } from '../interfaces/job';

@Component({
  selector: 'app-task-detail-user',
  templateUrl: './task-detail-user.component.html',
  styleUrls: ['./task-detail-user.component.css'],
})
export class TaskDetailUserComponent {
  taskId!: number;
  task!: Task | null;
  files: ApiFile[] = [];
  step!: Step | null;
  users: { [id: number]: User } = {};
  jobs: { [id: number]: Job } = {};

  unexecutedMethods: {
    methodExecution: MethodExecution;
    method: Method | null;
    inputs: { [key: string]: any };
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('taskId')) ?? 0;
    this.getTaskById(this.taskId);
  }

  getTaskById(taskId: number): void {
    this.apiService.getTaskById(taskId).subscribe(
      (task: Task) => {
        this.task = task;
        this.fetchFiles(task.fileIds);
        this.fetchStep(task.stepId);
        this.fetchUnexecutedMethods();
        this.fetchUsersForFeedbacks();
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

  fetchUnexecutedMethods(): void {
    if (this.task && this.task.methodExecutions) {
      this.task.methodExecutions.forEach((methodExecution) => {
        if (methodExecution && !methodExecution.executed) {
          this.fetchMethodDetails(methodExecution);
        }
      });
    }
  }

  fetchMethodDetails(methodExecution: MethodExecution): void {
    this.apiService.getMethodById(methodExecution.methodId).subscribe(
      (method: Method) => {
        const inputs: { [key: string]: any } = {};
        method.parameters.forEach((parameter) => {
          inputs[parameter.parameterName] = null;
        });
        this.unexecutedMethods.push({ methodExecution, method, inputs });
      },
      (error) => {
        console.error('Error fetching method:', error);
      }
    );
  }

  fetchUsersForFeedbacks(): void {
    if (this.task && this.task.feedbacks) {
      this.task.feedbacks.forEach((feedback) => {
        if (
          feedback &&
          feedback.userId !== null &&
          feedback.userId !== undefined
        ) {
          this.apiService.getUserById(feedback.userId).subscribe(
            (user: User) => {
              this.users[feedback.userId] = user;
              this.apiService.getJobByUserId(feedback.userId).subscribe(
                (job: Job) => {
                  this.jobs[feedback.userId] = job;
                },
                (error) => {
                  console.error('Error fetching job:', error);
                  this.jobs[feedback.userId] = {
                    title: 'Job not found',
                  } as Job;
                }
              );
            },
            (error) => {
              console.error('Error fetching user:', error);
              this.users[feedback.userId] = {
                fullName: 'User not found',
              } as User;
            }
          );
        }
      });
    }
  }

  getParameterInputType(parameterType: string): string {
    switch (parameterType) {
      case 'int':
        return 'number';
      case 'String':
      default:
        return 'text';
    }
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
  navigateToTaskListUser() {
    this.router.navigate(['/taskListUser']);
  }

  submitForm(): void {
    console.log('submitForm called');

    const userParametersByMethodExecutionId: {
      [methodExecutionId: number]: userParameter[];
    } = {};

    this.unexecutedMethods.forEach((item) => {
      if (item.methodExecution.id) {
        userParametersByMethodExecutionId[item.methodExecution.id] =
          Object.entries(item.inputs).map(
            ([parameterName, parameterValue]) => ({
              parameterName,
              parameterValue,
            })
          );
      }
    });
    console.log(
      'userParametersByMethodExecutionId:',
      userParametersByMethodExecutionId
    );

    this.apiService;

    this.apiService
      .executeMethodsForTask(this.taskId, userParametersByMethodExecutionId)
      .subscribe(
        (response) => {
          console.log('Methods executed successfully:', response);
          this.snackBar.open('Methods executed successfully', 'Close', {
            duration: 5000,
          });
        },
        (error) => {
          console.error('Error executing methods:', error);
          this.snackBar.open('Error executing methods', 'Close', {
            duration: 5000,
          });
        }
      );
  }
}
