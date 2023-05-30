import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Task } from '../interfaces/task';
import { Method } from '../interfaces/method';
import { MethodExecution } from '../interfaces/methodExecution';
import { Step } from '../interfaces/step';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';
import { Feedback } from '../interfaces/feedback';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-validate-task-details',
  templateUrl: './validate-task-details.component.html',
  styleUrls: ['./validate-task-details.component.css'],
})
export class ValidateTaskDetailsComponent {
  taskId!: number;
  task!: Task | null;
  step!: Step | null;
  methods: Method[] = [];
  methodExecutions: MethodExecution[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('taskId')) ?? 0;
    this.getTasksById(this.taskId);
  }

  getTasksById(taskId: number): void {
    this.apiService.getTaskById(taskId).subscribe(
      (task: Task) => {
        this.task = task;
        this.methodExecutions = task.methodExecutions.filter(
          (me) => me !== null
        ) as MethodExecution[];
        this.fetchStep(task.stepId);
        this.fetchMethods(task.methodIds);
      },
      (error) => {
        console.error('Error fetching task:', error);
      }
    );
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
  // markAsFailed() {
  //   this.apiService.invalidateTask(this.taskId).subscribe(
  //     () => {
  //       this.router.navigate(['/taskListUser']);
  //       this.snackBar.open('Task invalidated successfully', 'Close', {
  //         duration: 5000,
  //       });
  //     },
  //     (error) => {
  //       console.error('Error invalidating the task', error);
  //     }
  //   );
  // }

  markAsFailed() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '250px',
      data: { feedback: '' },
    });

    dialogRef.afterClosed().subscribe((feedbackMessage) => {
      if (feedbackMessage) {
        this.apiService
          .getUserByName(this.authService.currentUser.username)
          .subscribe(
            (user) => {
              const feedback: Feedback = {
                id: 0,
                message: feedbackMessage,
                feedbackDateTime: undefined,
                userId: user.id,
              };

              this.apiService.addFeedback(this.taskId, feedback).subscribe(
                (response) => {
                  console.log('Feedback added successfully');
                  this.apiService.invalidateTask(this.taskId).subscribe(
                    () => {
                      this.router.navigate(['/taskListUser']);
                      this.snackBar.open(
                        'Task invalidated successfully',
                        'Close',
                        {
                          duration: 5000,
                        }
                      );
                    },
                    (error) => {
                      console.error('Error invalidating the task', error);
                    }
                  );
                },
                (error) => {
                  console.error('Error adding feedback', error);
                }
              );
            },
            (error) => {
              console.error('Error getting user by name', error);
            }
          );
      }
    });
  }

  markAsPassed() {
    this.apiService.validateAndStartChildTasks(this.taskId).subscribe(
      () => {
        this.router.navigate(['/taskListUser']);
        this.snackBar.open('Task validated successfully', 'Close', {
          duration: 5000,
        });
      },
      (error) => {
        console.error('Error validating the task', error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/validateTasks']);
  }
}
