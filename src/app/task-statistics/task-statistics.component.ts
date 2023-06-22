import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-task-statistics',
  templateUrl: './task-statistics.component.html',
  styleUrls: ['./task-statistics.component.css'],
})
export class TaskStatisticsComponent {
  allPendingTasks!: number;
  allStartingTasks!: number;
  allWaitingForValidationTasks!: number;
  allFinishedTasks!: number;
  allTasks!: number;
  allProjects!: number;
  allPhases!: number;
  allSteps!: number;
  allUsers!: number;
  allJobs!: number;
  completionRateForAllTasks!: number;
  averageCompletionTimeForAllTasks!: number;
  colorScheme = 'vivid';
  gaugeDataOfCompletionRateForAllTasks!: any[];
  gaugeDataOfAverageCompletionTimeForAllTasks!: any[];
  barChartDataForAllProjects: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCountForAllTasksByStatus('PENDING').subscribe(
      (data) => {
        this.allPendingTasks = data;
        this.updateBarChartData();
      },
      (error) => {
        console.error(
          'Error fetching all tasks count by status PENDING: ',
          error
        );
      }
    );
    this.apiService.getCountForAllTasksByStatus('STARTING').subscribe(
      (data) => {
        this.allStartingTasks = data;
        this.updateBarChartData();
      },
      (error) => {
        console.error(
          'Error fetching all tasks count by status STARTING: ',
          error
        );
      }
    );

    this.apiService
      .getCountForAllTasksByStatus('WAITING_FOR_VALIDATION')
      .subscribe(
        (data) => {
          this.allWaitingForValidationTasks = data;
          this.updateBarChartData();
        },
        (error) => {
          console.error(
            'Error fetching all tasks count by status WAITING_FOR_VALIDATION: ',
            error
          );
        }
      );

    this.apiService.getCountForAllTasksByStatus('FINISHED').subscribe(
      (data) => {
        this.allFinishedTasks = data;
        this.updateBarChartData();
      },
      (error) => {
        console.error(
          'Error fetching all tasks count by status FINISHED: ',
          error
        );
      }
    );

    this.apiService.getCompletionRateForAllTasks().subscribe(
      (data) => {
        this.completionRateForAllTasks = data * 100;
        this.gaugeDataOfCompletionRateForAllTasks = [
          { name: 'Completion', value: this.completionRateForAllTasks },
        ];
      },
      (error) => {
        console.error('Error fetching completion rate for all tasks: ', error);
      }
    );

    this.apiService.getCountForAllTasks().subscribe(
      (data) => {
        this.allTasks = data;
      },
      (error) => {
        console.error('Error fetching all tasks count: ', error);
      }
    );

    this.apiService.getAverageCompletionTimeForAllTasks().subscribe(
      (data) => {
        this.averageCompletionTimeForAllTasks = data / 3600;
        this.gaugeDataOfAverageCompletionTimeForAllTasks = [
          {
            name: 'Average completion time',
            value: this.averageCompletionTimeForAllTasks,
          },
        ];
      },
      (error) => {
        console.error(
          'Error fetching average completion time for all tasks: ',
          error
        );
      }
    );

    this.apiService.getCountForAllProjects().subscribe(
      (data) => {
        this.allProjects = data;
      },
      (error) => {
        console.error('Error fetching all projects count: ', error);
      }
    );
    this.apiService.getCountForAllPhases().subscribe(
      (data) => {
        this.allPhases = data;
      },
      (error) => {
        console.error('Error fetching all phases count: ', error);
      }
    );

    this.apiService.getCountForAllSteps().subscribe(
      (data) => {
        this.allSteps = data;
      },
      (error) => {
        console.error('Error fetching all steps count: ', error);
      }
    );
    this.apiService.getCountForAllUsers().subscribe(
      (data) => {
        this.allUsers = data;
      },
      (error) => {
        console.error('Error fetching all users count: ', error);
      }
    );
    this.apiService.getCountForAllJobs().subscribe(
      (data) => {
        this.allJobs = data;
      },
      (error) => {
        console.error('Error fetching all jobs count: ', error);
      }
    );
  }

  updateBarChartData(): void {
    this.barChartDataForAllProjects = [
      { name: 'En attente', value: this.allPendingTasks },
      { name: 'En cours de démarrage', value: this.allStartingTasks },
      {
        name: 'En attente de validation',
        value: this.allWaitingForValidationTasks,
      },
      { name: 'Terminé', value: this.allFinishedTasks },
    ];
  }
}
