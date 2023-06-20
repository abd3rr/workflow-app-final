import { Component } from '@angular/core';
import { Project } from '../interfaces/project';
import { Phase } from '../interfaces/phase';
import { Step } from '../interfaces/step';
import { Task, TaskStatus } from '../interfaces/task';
import { ApiService } from '../services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataSet } from 'vis-data/peer';
import { Network } from 'vis-network/peer';

// For Data and Options types
import { Data, Options } from 'vis-network/declarations/network/Network';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mergeMap, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css'],
})
export class ListTasksComponent {
  projectList!: Project[];
  phaseList!: Phase[] | null;
  stepList!: Step[];
  taskList!: Task[];
  allTasksForSelectedProject!: Task[];
  tasksInitiated = false;

  constructor(private apiService: ApiService, private router: Router) {}
  ngOnInit(): void {
    this.getAllProjects();
  }

  taskForm = new FormGroup({
    project: new FormControl({}, Validators.required),
    phase: new FormControl({}, Validators.required),
    step: new FormControl({}, Validators.required),
  });

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

  getChildTask(childTaskId: number): Task | undefined {
    return this.taskList.find((task) => task.id === childTaskId);
  }

  generateGraph(): void {
    if (!this.taskList) return;

    // Create vis-network nodes and edges
    const nodes = new DataSet(
      this.taskList.map((task) => ({
        id: task.id,
        label: `${task.taskName?.toUpperCase()}\nPhase: ${
          task.phaseName
        }\nStep: ${task.stepName}\nJobs: ${
          task.assignedJobs
            ? task.assignedJobs.map((job) => job.title).join(', ')
            : 'None'
        }`,
        color: {
          background: this.getStatusColor(task.status),
          border: this.getStatusColor(task.status),
        },
      }))
    );

    const edges = new DataSet<any>(
      this.taskList.flatMap((task) => {
        return task.childTaskIds
          .filter((childId) => childId !== null)
          .map((childId) => ({
            from: task.id,
            to: childId,
            arrows: 'to',
            smooth: {
              type: 'curvedCCW',
              roundness: 0.2,
            },
          }));
      })
    );

    const data = {
      nodes: nodes as any,
      edges: edges,
    } as Data;

    const options: Options = {
      edges: {
        color: {
          color: '#848484',
          highlight: '#848484',
        },
      },
      nodes: {
        borderWidth: 1,
        borderWidthSelected: 1,
        shape: 'box',
      },
      layout: {
        hierarchical: {
          enabled: true,
          levelSeparation: 150,
          nodeSpacing: 200,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: 'UD', // Up-Down direction. Change to 'LR' for Left-Right direction.
          sortMethod: 'hubsize', // 'direct' Or 'hubsize'
        },
        randomSeed: 2, // Seed to ensure the layout is the same every time the graph is generated
        improvedLayout: true,
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -3000,
          centralGravity: 0.3,
          springLength: 250,
          springConstant: 0.01,
          damping: 0.09,
          avoidOverlap: 0.1,
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        solver: 'barnesHut',
        timestep: 0.35,
        stabilization: { iterations: 150 },
      },
      interaction: {
        zoomView: true,
        zoomSpeed: 1,
        zoomExtent: {
          min: 0.5,
          max: 1.5,
        },
      },
    };

    const container = document.getElementById('network');
    if (container) {
      const network = new Network(container, data, options);
      network.fit({
        animation: { duration: 500, easingFunction: 'easeInOutQuad' },
      });
      network.on('selectNode', (params) => {
        if (params.nodes.length > 0) {
          const clickedNodeId = params.nodes[0];
          console.log('Clicked Node ID:', clickedNodeId);
          this.router.navigate(['/taskDetails', clickedNodeId]);
        }
      });
    }
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case 'PENDING':
        return '#FFA500';
      case 'STARTING':
        return '#1E90FF';
      case 'FINISHED':
        return '#32CD32';
      case 'WAITING_FOR_VALIDATION':
        return '#FF69B4';
    }
  }

  onProjectSelected() {
    this.tasksInitiated = false;
    const selectedProject = this.taskForm.get('project')?.value as Project;

    if (selectedProject && selectedProject.phases) {
      this.phaseList = selectedProject.phases;
    } else {
      this.phaseList = null;
      this.taskForm.get('phase')?.setValue(null);
    }

    this.stepList = [];
    this.taskForm.get('step')?.setValue(null);

    if (selectedProject) {
      this.apiService
        .getTasksByProjectId(selectedProject.id)
        .pipe(
          mergeMap((tasks: Task[]) => {
            this.allTasksForSelectedProject = tasks;

            // Extend task details
            this.taskList = tasks.map((task) => {
              if (task.id !== null && selectedProject.phases) {
                selectedProject.phases.forEach((phase: Phase) => {
                  phase.steps.forEach((step: Step) => {
                    if (step.id === task.stepId) {
                      task.phaseName = phase.phaseName;
                      task.phaseId = phase.id;
                      task.stepName = step.stepName;
                    }
                  });
                });
              }
              return task;
            });

            // Transform tasks to an array of Observables for each assignedJobId
            const jobObservables = tasks
              .filter(
                (task) => task.assignedJobIds && task.assignedJobIds.length > 0
              )
              .map((task) =>
                forkJoin(
                  task.assignedJobIds.map((jobId) =>
                    this.apiService.getJobById(jobId)
                  )
                ).pipe(
                  map((jobs) => ({ ...task, assignedJobs: jobs })) // Merge jobs into the task
                )
              );

            return forkJoin(jobObservables); // Join all Observables
          })
        )
        .subscribe(
          (tasksWithJobs: Task[]) => {
            this.taskList = tasksWithJobs;
            this.generateGraph();
            this.tasksInitiated = tasksWithJobs.some(
              (task) => task.status !== 'PENDING'
            );
          },
          (error) => {
            console.error('Error fetching tasks:', error);
          }
        );
    }
  }

  onPhaseSelected() {
    const selectedPhase = this.taskForm.get('phase')?.value as Phase;
    if (selectedPhase && selectedPhase.steps) {
      this.stepList = selectedPhase.steps;
    } else {
      this.stepList = [];
      this.taskForm.get('step')?.setValue(null); // Reset the 'step' form control to null.
    }
    if (selectedPhase) {
      this.taskList = this.allTasksForSelectedProject.filter(
        (task) => task.phaseId === selectedPhase.id
      );
      this.generateGraph();
    }
  }

  onStepSelected() {
    const selectedPhase = this.taskForm.get('phase')?.value as Phase;
    const selectedStep = this.taskForm.get('step')?.value as Step;

    if (selectedPhase && selectedStep) {
      this.taskList = this.allTasksForSelectedProject.filter(
        (task) =>
          task.stepId === selectedStep.id && task.phaseId === selectedPhase.id
      );
      this.generateGraph();
    }
  }

  onSubmit() {
    const selectedProject = this.taskForm.get('project')?.value as Project;
    if (selectedProject && selectedProject.id) {
      this.apiService
        .startInitialTasks(selectedProject.id.toString())
        .subscribe(
          (tasks: Task[]) => {
            console.log('Tasks initiated:', tasks);
            this.tasksInitiated = true;
            this.onProjectSelected(); // Refresh the task list and graph
          },
          (error) => {
            console.error('Error initiating tasks:', error);
          }
        );
    } else {
      console.error('Step ID not found');
    }
  }
  resetFilters() {
    const selectedProject = this.taskForm.get('project')?.value as Project;
    this.taskForm.get('phase')?.setValue(null);
    this.taskForm.get('step')?.setValue(null);
    this.generateGraph();
  }
}
