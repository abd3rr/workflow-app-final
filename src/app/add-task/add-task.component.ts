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
import { catchError, forkJoin, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiFile } from '../interfaces/apiFile';

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
  selectedFiles: File[] = [];
  projectFiles: ApiFile[] = [];
  selectedExisitingFiles?: ApiFile[] | null = null;
  selectedMethods: Method[] = [];
  sanitizer: any;
  nonPreviewableFilesExist = false;
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
    this.taskForm
      .get('existingFiles')
      ?.valueChanges.subscribe((value) => console.log(value));
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
    selectedMethod: new FormControl(null),
    existingFiles: new FormControl(null),
  });

  // Method to handle adding a method to the selected methods list
  addMethod() {
    const selectedMethod = this.taskForm.get('selectedMethod')?.value;
    if (selectedMethod) {
      this.selectedMethods.push(selectedMethod);
    }
    // Reset the selectedMethod control
    this.taskForm.get('selectedMethod')?.setValue(null);
  }

  // Method to handle removing a method from the selected methods list
  removeMethod(method: Method) {
    const index = this.selectedMethods.indexOf(method);
    if (index > -1) {
      this.selectedMethods.splice(index, 1);
    }
  }

  onSubmit() {
    console.log(
      'Step form control value:',
      (this.taskForm.get('step')?.value as Step).id
    );

    const createTask = (fileIds?: number[]) => {
      // Create the task object with all the necessary fields
      const existingFiles = this.taskForm.get('existingFiles')?.value || [];
      let existingFilesIds: number[] = [];

      existingFiles.forEach((file: ApiFile) => {
        if (file.id) {
          existingFilesIds.push(file.id);
        }
      });

      const task: Task = {
        id: 0,
        taskName: this.taskForm.get('taskName')?.value,
        description: this.taskForm.get('description')?.value,
        instructions: this.taskForm.get('instructions')?.value,
        requiredVerification: this.taskForm.get('requiredVerification')
          ?.value as boolean,

        stepId: (this.taskForm.get('step')?.value as Step).id,

        fileIds:
          (fileIds && fileIds.length > 0) || existingFilesIds.length > 0
            ? [
                ...(fileIds || []),
                ...existingFilesIds.filter(
                  (id: any) => id !== null && id !== undefined
                ),
              ]
            : [],

        methodIds: [], // We will add the method IDs later
        assignedJobIds: [], // We will add the job IDs later
        parentTaskIds: (this.taskForm.get('parentTask')?.value as Task[] | null)
          ? (this.taskForm.get('parentTask')?.value as Task[])
              .filter((task: Task | undefined) => task !== undefined)
              .map((task: Task) => task.id)
          : [],

        childTaskIds: [], // We don't set the child tasks
        methodExecutions: [], // we don't set the methods execution
        feedbacks: [], // we don't set the feedbacks
        status: 'PENDING',
        isDisabled: false,
      };

      // Add the assigned jobs to the task object
      const assignedJobs = this.taskForm.get('assignedJobs')?.value as Job[];
      task.assignedJobIds = assignedJobs
        .map((job: Job) => job.id)
        .filter((id): id is number => id !== null);

      task.methodIds = this.selectedMethods
        .map((method: Method) => method.id)
        .filter((id) => id !== null && id !== undefined) as number[];

      // Create the task using the ApiService
      this.apiService.createTask(task).subscribe(
        (taskResponse) => {
          console.log('Task created:', taskResponse);
          this.taskForm.get('taskName')?.reset();
          this.taskForm.get('description')?.reset();
          this.taskForm.get('assignedJobs')?.reset();
          this.taskForm.get('parentTask')?.reset();
          this.taskForm.get('file')?.reset();
          this.taskForm.get('existingFiles')?.reset();
          this.taskForm.get('requiredVerification')?.reset();
          this.taskForm.get('instructions')?.reset();
          this.methodList.forEach((method: Method) => {
            this.taskForm.get(method.methodName)?.reset();
          });
          this.selectedFiles = [];
          this.selectedMethods = [];
          this.selectedExisitingFiles = null;
          // Refresh the list of files after creating a new task
          const selectedProject = this.taskForm.get('project')
            ?.value as Project;
          if (selectedProject && selectedProject.id) {
            this.getFilesByProjectId(selectedProject.id);
          }

          // Refresh the list of tasks after creating a new task
          this.onStepSelected();
          this.snackBar.open('Task created successfully', 'Close', {
            duration: 5000,
          });
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

    if (this.selectedFiles.length > 0) {
      const uploadRequests = this.selectedFiles.map((file) =>
        this.apiService.createFile(file).pipe(
          map((fileResponse: any) => fileResponse.body?.id),
          catchError((error) => {
            console.log('Error creating file:', error);
            return of(null);
          })
        )
      );

      forkJoin(uploadRequests).subscribe((fileIds) => {
        fileIds = fileIds.filter((id) => id !== null);
        if (fileIds.length === this.selectedFiles.length) {
          console.log('All files uploaded successfully');
          createTask(fileIds);
        } else {
          console.log('Some files failed to upload');
          // Handle error here...
        }
      });
    } else {
      createTask();
    }
  }
  getFilesByProjectId(projectId: number) {
    this.apiService.getFilesByProjectId(projectId).subscribe(
      (files) => {
        this.projectFiles = files;
      },
      (error) => {
        console.log('Error getting files:', error);
      }
    );
  }

  onProjectSelected() {
    const selectedProject = this.taskForm.get('project')?.value as Project;
    console.log('aaaaaaaaa');
    if (selectedProject && selectedProject.phases && selectedProject.id) {
      this.phaseList = selectedProject.phases;
      this.taskForm.patchValue({ phase: null, step: null });
      this.taskList = [];
      this.getFilesByProjectId(selectedProject.id);
      this.selectedExisitingFiles = null;
    }
  }
  onPhaseSelected() {
    const selectedPhase = this.taskForm.get('phase')?.value as Phase;
    if (selectedPhase && selectedPhase.steps) {
      this.stepList = selectedPhase.steps;
    } else {
      this.taskForm.patchValue({ phase: null, step: null, parentTask: null });
    }
    this.taskList = [];
  }

  onStepSelected() {
    const selectedProject = this.taskForm.get('project')?.value as Project;
    if (selectedProject !== null) {
      this.apiService
        .getTasksByProjectId(selectedProject.id)
        .subscribe((tasksResponse) => {
          this.taskList = tasksResponse;
        });
    }
  }
  onExistingFileSelected() {
    const selectedExistingFiles = this.taskForm.get('existingFiles')?.value;
    if (selectedExistingFiles !== null) {
      this.selectedExisitingFiles = selectedExistingFiles;
    } else {
      this.selectedExisitingFiles = null;
    }
  }

  // onExistingFileSelected() {
  //   const selectedExistingFiles: number[] | null =
  //     this.taskForm.get('existingFiles')?.value || null;
  //   if (selectedExistingFiles) {
  //     this.selectedExisitingFiles = this.projectFiles.filter(
  //       (file) =>
  //         file.id !== null &&
  //         (selectedExistingFiles as number[]).includes(file.id)
  //     );
  //   } else {
  //     this.selectedExisitingFiles = null;
  //   }
  // }
  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFiles = Array.from(target.files);
      console.log('Selected files:', this.selectedFiles);
    } else {
      this.selectedFiles = [];
    }
  }

  previewImage(file: ApiFile) {
    if (file.id) {
      this.apiService.getFileForPreview(file.id).subscribe((blob) => {
        let fileUrl;
        if (file.contentType.startsWith('image')) {
          fileUrl = URL.createObjectURL(blob);
          window.open(fileUrl);
        } else if (file.contentType === 'application/pdf') {
          fileUrl = URL.createObjectURL(blob);
          window.open(fileUrl);
        } else {
          // For simplicity, let's download the file
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = file.fileName;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      });
    }
  }
}
