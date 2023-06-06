import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Phase } from '../interfaces/phase';
import { Project } from '../interfaces/project';
import { Step } from '../interfaces/step';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-statistics-with-filters',
  templateUrl: './task-statistics-with-filters.component.html',
  styleUrls: ['./task-statistics-with-filters.component.css'],
})
export class TaskStatisticsWithFiltersComponent {
  projectList!: Project[];
  phaseList!: Phase[] | null;
  stepList!: Step[];
  filterForm = new FormGroup({
    project: new FormControl({}, Validators.required),
    phase: new FormControl({}, Validators.required),
    step: new FormControl({}, Validators.required),
  });

  pendingTasks!: number;
  startingTasks!: number;
  waitingForValidationTasks!: number;
  finishedTasks!: number;
  tasks!: number;
  phases!: number;
  steps!: number;
  stepsInPhase!: number | null;
  completionRate!: number;
  averageCompletionTime!: number;
  colorScheme = 'vivid';
  gaugeDataOfCompletionRate!: any[];
  gaugeDataOfAverageCompletionTime!: any[];
  barChartData: any[] = [];
  selectedProject?: Project;
  selectedPhase?: Phase;
  selectedStep?: Step;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getAllProjects();
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
    const selectedProject = this.filterForm.get('project')?.value as Project;
    this.selectedProject = selectedProject;
    if (selectedProject && selectedProject.phases) {
      this.phaseList = selectedProject.phases;
    } else {
      this.phaseList = null;
      this.selectedPhase = undefined;
      this.filterForm.get('phase')?.setValue(null);
    }

    this.stepList = [];
    this.selectedStep = undefined;
    this.filterForm.get('step')?.setValue(null);
    if (selectedProject && selectedProject.id) {
      // TO DO ...
      this.apiService
        .getCountForProjectByStatus(selectedProject.id, 'PENDING')
        .subscribe(
          (data) => {
            this.pendingTasks = data;
            console.log('Pending tasks: ', this.pendingTasks);
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status PENDING: ',
              error
            );
          }
        );

      this.apiService
        .getCountForProjectByStatus(selectedProject.id, 'STARTING')
        .subscribe(
          (data) => {
            this.startingTasks = data;
            console.log('Starting tasks: ', this.startingTasks);
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status STARTING: ',
              error
            );
          }
        );

      this.apiService
        .getCountForProjectByStatus(
          selectedProject.id,
          'WAITING_FOR_VALIDATION'
        )
        .subscribe(
          (data) => {
            this.waitingForValidationTasks = data;
            console.log(
              'Waiting for validation tasks: ',
              this.waitingForValidationTasks
            );
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status WAITING_FOR_VALIDATION: ',
              error
            );
          }
        );

      this.apiService
        .getCountForProjectByStatus(selectedProject.id, 'FINISHED')
        .subscribe(
          (data) => {
            this.finishedTasks = data;
            console.log('Finished tasks: ', this.finishedTasks);
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status FINISHED: ',
              error
            );
          }
        );

      this.apiService.getCountForPhasesInProject(selectedProject.id).subscribe(
        (data) => {
          this.phases = data;
          console.log('Phases: ', this.phases);
        },
        (error) => {
          console.error('Error fetching phases count by project: ', error);
        }
      );

      this.apiService.getCountForStepsInProject(selectedProject.id).subscribe(
        (data) => {
          this.steps = data;
          console.log('Steps: ', this.steps);
        },
        (error) => {
          console.error('Error fetching steps count by project: ', error);
        }
      );

      this.apiService.getCompletionRateForProject(selectedProject.id).subscribe(
        (data) => {
          this.completionRate = data * 100;
          console.log('Completion rate: ', this.completionRate);
          this.gaugeDataOfCompletionRate = [
            {
              name: 'Completion rate',
              value: this.completionRate,
            },
          ];
        },
        (error) => {
          console.error('Error fetching completion rate for project: ', error);
        }
      );

      this.apiService
        .getAverageCompletionTimeForProject(selectedProject.id)
        .subscribe(
          (data) => {
            this.averageCompletionTime = data;
            console.log('Average completion rate ', this.averageCompletionTime);
            this.gaugeDataOfAverageCompletionTime = [
              {
                name: 'Average completion time',
                value: this.averageCompletionTime,
              },
            ];
          },
          (error) => {
            console.error(
              'Error fetching average completion rate for project: ',
              error
            );
          }
        );
    }
  }

  onPhaseSelected() {
    const selectedPhase = this.filterForm.get('phase')?.value as Phase;
    const selectedProject = this.filterForm.get('project')?.value as Project;
    this.selectedPhase = selectedPhase;
    if (selectedPhase && selectedPhase.steps) {
      this.stepList = selectedPhase.steps;
    } else {
      this.stepList = [];
      this.selectedStep = undefined;
      this.filterForm.get('step')?.setValue(null); // Reset the 'step' form control to null.
    }
    if (
      selectedPhase &&
      selectedPhase.id &&
      selectedProject &&
      selectedProject.id
    ) {
      // TO DO ...
      this.apiService
        .getCountForProjectAndPhaseByStatus(
          selectedProject.id,
          selectedPhase.id,
          'PENDING'
        )
        .subscribe(
          (data) => {
            this.pendingTasks = data;
            console.log('Pending tasks: ', this.pendingTasks);
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status PENDING: ',
              error
            );
          }
        );

      this.apiService
        .getCountForProjectAndPhaseByStatus(
          selectedProject.id,
          selectedPhase.id,
          'STARTING'
        )
        .subscribe(
          (data) => {
            this.startingTasks = data;
            console.log('Starting tasks: ', this.startingTasks);
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status STARTING: ',
              error
            );
          }
        );

      this.apiService
        .getCountForProjectAndPhaseByStatus(
          selectedProject.id,
          selectedPhase.id,
          'WAITING_FOR_VALIDATION'
        )
        .subscribe(
          (data) => {
            this.waitingForValidationTasks = data;
            console.log(
              'Waiting for validation tasks: ',
              this.waitingForValidationTasks
            );
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status WAITING_FOR_VALIDATION: ',
              error
            );
          }
        );

      this.apiService
        .getCountForProjectAndPhaseByStatus(
          selectedProject.id,
          selectedPhase.id,
          'FINISHED'
        )
        .subscribe(
          (data) => {
            this.finishedTasks = data;
            console.log('Finished tasks: ', this.finishedTasks);
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status FINISHED: ',
              error
            );
          }
        );

      this.apiService.getCountForPhasesInProject(selectedProject.id).subscribe(
        (data) => {
          this.phases = data;
          console.log('Phases: ', this.phases);
        },
        (error) => {
          console.error('Error fetching phases count by project: ', error);
        }
      );

      this.apiService.getCountForStepsInProject(selectedProject.id).subscribe(
        (data) => {
          this.steps = data;
          console.log('Steps: ', this.steps);
        },
        (error) => {
          console.error('Error fetching steps count by project: ', error);
        }
      );
      this.apiService.getCountForStepsInPhase(selectedPhase.id).subscribe(
        (data) => {
          this.stepsInPhase = data;
          console.log('Steps in phase: ', this.stepsInPhase);
        },
        (error) => {
          console.error('Error fetching steps count by phase: ', error);
        }
      );

      this.apiService
        .getCompletionRateForProjectAndPhase(
          selectedProject.id,
          selectedPhase.id
        )
        .subscribe(
          (data) => {
            this.completionRate = data * 100;
            console.log('Completion rate: ', this.completionRate);
            this.gaugeDataOfCompletionRate = [
              {
                name: 'Completion rate',
                value: this.completionRate,
              },
            ];
          },
          (error) => {
            console.error(
              'Error fetching completion rate for project: ',
              error
            );
          }
        );

      this.apiService
        .getAverageCompletionTimeForProjectAndPhase(
          selectedProject.id,
          selectedPhase.id
        )
        .subscribe(
          (data) => {
            this.averageCompletionTime = data;
            console.log('Average completion rate ', this.averageCompletionTime);
            this.gaugeDataOfAverageCompletionTime = [
              {
                name: 'Average completion time',
                value: this.averageCompletionTime,
              },
            ];
          },
          (error) => {
            console.error(
              'Error fetching average completion rate for project: ',
              error
            );
          }
        );
    }
  }

  onStepSelected() {
    const selectedStep = this.filterForm.get('step')?.value as Step;
    const selectedPhase = this.filterForm.get('phase')?.value as Phase;
    const selectedProject = this.filterForm.get('project')?.value as Project;
    this.selectedStep = selectedStep;
    if (
      selectedStep &&
      selectedStep.id &&
      selectedPhase &&
      selectedPhase.id &&
      selectedProject &&
      selectedProject.id
    ) {
      // TO DO ...
      this.apiService
        .getCountForProjectAndPhaseAndStepByStatus(
          selectedProject.id,
          selectedPhase.id,
          selectedStep.id,
          'PENDING'
        )
        .subscribe(
          (data) => {
            this.pendingTasks = data;
            console.log('Pending tasks: ', this.pendingTasks);
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status PENDING: ',
              error
            );
          }
        );

      this.apiService
        .getCountForProjectAndPhaseAndStepByStatus(
          selectedProject.id,
          selectedPhase.id,
          selectedStep.id,
          'STARTING'
        )
        .subscribe(
          (data) => {
            this.startingTasks = data;
            console.log('Starting tasks: ', this.startingTasks);
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status STARTING: ',
              error
            );
          }
        );

      this.apiService
        .getCountForProjectAndPhaseAndStepByStatus(
          selectedProject.id,
          selectedPhase.id,
          selectedStep.id,
          'WAITING_FOR_VALIDATION'
        )
        .subscribe(
          (data) => {
            this.waitingForValidationTasks = data;
            console.log(
              'Waiting for validation tasks: ',
              this.waitingForValidationTasks
            );
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status WAITING_FOR_VALIDATION: ',
              error
            );
          }
        );

      this.apiService
        .getCountForProjectAndPhaseAndStepByStatus(
          selectedProject.id,
          selectedPhase.id,
          selectedStep.id,
          'FINISHED'
        )
        .subscribe(
          (data) => {
            this.finishedTasks = data;
            console.log('Finished tasks: ', this.finishedTasks);
            this.updateBarChartData();
          },
          (error) => {
            console.error(
              'Error fetching tasks count by status FINISHED: ',
              error
            );
          }
        );

      this.apiService.getCountForPhasesInProject(selectedProject.id).subscribe(
        (data) => {
          this.phases = data;
          console.log('Phases: ', this.phases);
        },
        (error) => {
          console.error('Error fetching phases count by project: ', error);
        }
      );

      this.apiService.getCountForStepsInProject(selectedProject.id).subscribe(
        (data) => {
          this.steps = data;
          console.log('Steps: ', this.steps);
        },
        (error) => {
          console.error('Error fetching steps count by project: ', error);
        }
      );
      this.apiService.getCountForStepsInPhase(selectedPhase.id).subscribe(
        (data) => {
          this.stepsInPhase = data;
          console.log('Steps in phase: ', this.stepsInPhase);
        },
        (error) => {
          console.error('Error fetching steps count by phase: ', error);
        }
      );

      this.apiService
        .getCompletionRateForProjectAndPhaseAndStep(
          selectedProject.id,
          selectedPhase.id,
          selectedStep.id
        )
        .subscribe(
          (data) => {
            this.completionRate = data * 100;
            console.log('Completion rate: ', this.completionRate);
            this.gaugeDataOfCompletionRate = [
              {
                name: 'Completion rate',
                value: this.completionRate,
              },
            ];
          },
          (error) => {
            console.error(
              'Error fetching completion rate for project: ',
              error
            );
          }
        );

      this.apiService
        .getAverageCompletionTimeForProjectAndPhaseAndStep(
          selectedProject.id,
          selectedPhase.id,
          selectedStep.id
        )
        .subscribe(
          (data) => {
            this.averageCompletionTime = data;
            console.log('Average completion rate ', this.averageCompletionTime);
            this.gaugeDataOfAverageCompletionTime = [
              {
                name: 'Average completion time',
                value: this.averageCompletionTime,
              },
            ];
          },
          (error) => {
            console.error(
              'Error fetching average completion rate for project: ',
              error
            );
          }
        );
    }
  }

  updateBarChartData(): void {
    this.barChartData = [
      { name: 'Pending', value: this.pendingTasks },
      { name: 'Starting', value: this.startingTasks },
      {
        name: 'Waiting for Validation',
        value: this.waitingForValidationTasks,
      },
      { name: 'Finished', value: this.finishedTasks },
    ];
  }
  resetFilters() {
    this.filterForm.get('project')?.setValue(null);
    this.filterForm.get('phase')?.setValue(null);
    this.filterForm.get('step')?.setValue(null);
    this.pendingTasks = 0;
    this.startingTasks = 0;
    this.waitingForValidationTasks = 0;
    this.finishedTasks = 0;
    this.tasks = 0;
    this.phases = 0;
    this.steps = 0;
    this.stepsInPhase = null;
    this.completionRate = 0;
    this.averageCompletionTime = 0;
    this.gaugeDataOfCompletionRate = [];
    this.gaugeDataOfAverageCompletionTime = [];
    this.barChartData = [];
    this.selectedProject = undefined;
    this.selectedPhase = undefined;
    this.selectedStep = undefined;
    this.phaseList = null;
    this.stepList = [];
    this.onProjectSelected();
  }
}
