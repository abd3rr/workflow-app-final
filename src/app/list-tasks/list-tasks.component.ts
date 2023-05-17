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
        label: task.taskName,
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
        randomSeed: 2, // Seed to ensure the layout is the same every time the graph is generated
        improvedLayout: true,
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.01,
          damping: 0.09,
          avoidOverlap: 0,
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
      default:
        return '#FFFFFF';
    }
  }

  onProjectSelected() {
    const selectedProject = this.taskForm.get('project')?.value as Project;
    console.log('aaaaaaaaa');
    if (selectedProject && selectedProject.phases) {
      this.phaseList = selectedProject.phases;
    }
  }
  onPhaseSelected() {
    const selectedPhase = this.taskForm.get('phase')?.value as Phase;
    if (selectedPhase && selectedPhase.steps) {
      this.stepList = selectedPhase.steps;
    } else {
    }
  }
  onStepSelected() {
    this.tasksInitiated = false;
    const selectedStep = this.taskForm.get('step')?.value as Step;
    if (selectedStep) {
      this.apiService.getTasksByStepId(selectedStep.id).subscribe(
        (tasks: Task[]) => {
          this.taskList = tasks;
          this.generateGraph();

          // Check if the tasks are initiated for the selected step
          this.tasksInitiated = tasks.some((task) => task.status !== 'PENDING');
        },
        (error) => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }

  onSubmit() {
    const selectedStep = this.taskForm.get('step')?.value as Step;
    if (selectedStep && selectedStep.id) {
      this.apiService.startInitialTasks(selectedStep.id.toString()).subscribe(
        (tasks: Task[]) => {
          console.log('Tasks initiated:', tasks);
          this.tasksInitiated = true;
          this.onStepSelected(); // Refresh the task list and graph
        },
        (error) => {
          console.error('Error initiating tasks:', error);
        }
      );
    } else {
      console.error('Step ID not found');
    }
  }
}
