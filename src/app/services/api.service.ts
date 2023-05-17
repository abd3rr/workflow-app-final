import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import { config } from '../config/config';
import { ERROR_MESSAGES } from '../errors/error-messages';
import { Task, TaskStatus } from '../interfaces/task';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private baseUrl = config.apiUrl;

  public createProject(
    projectName: string,
    description: string | null
  ): Observable<any> {
    const url = `${this.baseUrl}/projects`;
    const body = { projectName, description };
    return this.http.post(url, body).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred creating the project:', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getProjectIdByName(projectName: string): Observable<any> {
    const url = `${
      this.baseUrl
    }/projects/idByName?projectName=${encodeURIComponent(projectName)}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred getting the project ID by Name:', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public createPhase(
    projectId: string,
    phaseName: string,
    description: string | null
  ): Observable<any> {
    if (!projectId) {
      throw new Error('Project ID is not defined');
    }
    const body = { phaseName, description };
    const url = `${this.baseUrl}/phases/projects/${projectId}`;
    return this.http.post(url, body).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred creating the phase:', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public createStep(
    phaseId: string,
    stepName: string,
    description: string | null
  ): Observable<any> {
    if (!phaseId) {
      throw new Error('Phase ID is not defined');
    }
    const body = { stepName, description };
    const url = `${this.baseUrl}/steps/phases/${phaseId}`;
    return this.http.post(url, body).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occured creating the step: ', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getPhaseIdByNameAndProjectName(
    phaseName: string,
    projectName: string
  ): Observable<any> {
    const url = `${
      this.baseUrl
    }/phases/idByNameAndProjectName?phaseName=${encodeURIComponent(
      phaseName
    )}&projectName=${encodeURIComponent(projectName)}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred getting the phase ID:', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public deleteProject(projectId: string): Observable<any> {
    const url = `${this.baseUrl}/projects/${projectId}`;
    return this.http.delete(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred deleting the phase:', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getAllProjects(): Observable<any> {
    const url = `${this.baseUrl}/projects`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occured getting the projects: ', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  getAllJobs(): Observable<any> {
    const url = `${this.baseUrl}/jobs`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occured getting the jobs: ', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getPhasesByProjectId(id: number): Observable<any> {
    const url = `${this.baseUrl}/phases/project/${id}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log(
          'An error occured getting the phases with project ID: ',
          id
        );
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getStepsByPhaseId(id: number): Observable<any> {
    const url = `${this.baseUrl}/steps/phase/${id}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occured getting the steps with phase ID: ', id);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getTasksByStepId(id: number | null): Observable<any> {
    const url = `${this.baseUrl}/tasks/step/${id}`;
    if (id === null) {
      return throwError('Step ID cannot be null.');
    }
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occured getting the tasks with step ID: ', id);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public createTask(task: Task): Observable<any> {
    const url = `${this.baseUrl}/tasks`;
    return this.http.post(url, task).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred creating the task:', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getAllMethods(): Observable<any> {
    const url = `${this.baseUrl}/methods`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred getting the methods:', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public createFile(file: File): Observable<any> {
    const acceptedExtensions = [
      'pdf',
      'doc',
      'docx',
      'txt',
      'ppt',
      'pptx',
      'xls',
      'xlsx',
      'rtf',
      'png',
      'jpeg',
      'gif',
      'bmp',
      'webp',
      'svg+xml',
      'pptm',
      'ppsm',
      'ppam',
      'potm',
      'docm',
      'dotm',
      'xlsm',
      'xltm',
      'xlam',
      'xlsb',
    ];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !acceptedExtensions.includes(fileExtension)) {
      console.log('Invalid file type:', file.name);
      return throwError(
        'Invalid file type. Only PDF, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX, and RTF files are allowed.'
      );
    }

    const url = `${this.baseUrl}/files`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http
      .post(url, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        tap((response) => console.log('API response:', response)),
        retry(3),
        catchError((error) => {
          console.log('An error occurred creating the file:', error);
          return throwError(ERROR_MESSAGES.GENERAL);
        })
      );
  }

  public getTaskById(id: number): Observable<any> {
    const url = `${this.baseUrl}/tasks/${id}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred getting the task with ID: ', id);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }
  public getStepById(id: number): Observable<any> {
    const url = `${this.baseUrl}/steps/${id}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred getting the step with ID: ', id);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getMethodById(id: number): Observable<any> {
    const url = `${this.baseUrl}/methods/${id}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred getting the step with ID: ', id);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getTaskNameById(id: number): Observable<string> {
    const url = `${this.baseUrl}/tasks/${id}/name`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        console.error(
          'Error getting the task name with ID:',
          id,
          error.message,
          error.error
        );
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getFileById(id: number): Observable<any> {
    const url = `${this.baseUrl}/files/${id}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred getting the file with ID: ', id);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public downloadFile(fileId: number): Observable<void> {
    const url = `${this.baseUrl}/files/download/${fileId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
    });
    const options = {
      headers,
      observe: 'response' as 'body',
      responseType: 'blob' as 'json',
    };

    return this.http.get<HttpResponse<Blob>>(url, options).pipe(
      map((response: HttpResponse<Blob>) => {
        const file = response.body as Blob;
        const fileUrl = window.URL.createObjectURL(file);
        const fileExtension =
          response.headers.get('X-File-Extension')?.replace('.', '') || 'ext';
        saveAs(file, `file-${fileId}.${fileExtension}`);
        window.URL.revokeObjectURL(fileUrl);
      }),
      catchError((error) => {
        console.log('An error occurred downloading the file:', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public updateTaskStatus(
    taskId: string,
    newStatus: TaskStatus
  ): Observable<any> {
    if (!taskId) {
      throw new Error('Task ID is not defined');
    }
    const body = { newStatus };
    const url = `${this.baseUrl}/tasks/${taskId}/status`;
    return this.http.put(url, body).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred updating the task status: ', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public startInitialTasks(stepId: string): Observable<any> {
    if (!stepId) {
      throw new Error('Step ID is not defined');
    }
    const url = `${this.baseUrl}/tasks/${stepId}/startInitialTasks`;
    return this.http.post(url, null).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred starting the initial tasks: ', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getTasksByJobIdsStatusProjectPhaseStep(
    jobIds: number[],
    status: TaskStatus,
    projectId?: number,
    phaseId?: number,
    stepId?: number
  ): Observable<any[]> {
    if (!jobIds || jobIds.length === 0) {
      throw new Error('Job IDs are not defined or empty');
    }
    if (!status) {
      throw new Error('Status is not defined');
    }

    const url = `${this.baseUrl}/tasks/filter`;
    let params = new HttpParams()
      .set('jobIds', jobIds.join(','))
      .set('status', status);

    // If projectId, phaseId, or stepId are provided, add them to the query parameters
    if (projectId) {
      params = params.set('projectId', projectId.toString());
    }
    if (phaseId) {
      params = params.set('phaseId', phaseId.toString());
    }
    if (stepId) {
      params = params.set('stepId', stepId.toString());
    }

    return this.http.get<any[]>(url, { params }).pipe(
      retry(3),
      catchError((error) => {
        console.log(
          'An error occurred getting tasks by job IDs, status, and optional project, phase, and step IDs:',
          error
        );
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public getJobByUserId(userId: number): Observable<any> {
    if (!userId) {
      throw new Error('User ID is not defined');
    }
    const url = `${this.baseUrl}/users/${userId}/job`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred getting the job by user ID: ', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }
  public getUserByName(name: string): Observable<any> {
    if (!name) {
      throw new Error('Name is not defined');
    }
    const url = `${this.baseUrl}/users/name/${name}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        console.log('An error occurred getting the user by name: ', error);
        if (error.status === 404) {
          return throwError(ERROR_MESSAGES.NOT_FOUND);
        } else {
          return throwError(ERROR_MESSAGES.GENERAL);
        }
      })
    );
  }

  public getMethodExecutionsByTaskId(taskId: number): Observable<any> {
    if (!taskId) {
      throw new Error('Task ID is not defined');
    }
    const url = `${this.baseUrl}/tasks/${taskId}/methodExecutions`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        console.log(
          'An error occurred getting the method executions for task with ID: ',
          error
        );
        if (error.status === 404) {
          return throwError(ERROR_MESSAGES.NOT_FOUND);
        } else {
          return throwError(ERROR_MESSAGES.GENERAL);
        }
      })
    );
  }

  public executeMethodsForTask(
    taskId: number,
    userParametersByMethodExecutionId: { [methodExecutionId: number]: any[] }
  ): Observable<any> {
    if (!taskId) {
      throw new Error('Task ID is not defined');
    }
    const url = `${this.baseUrl}/tasks/${taskId}/executeMethods`;
    return this.http.post(url, userParametersByMethodExecutionId).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        console.log(
          'An error occurred executing methods for task with ID: ',
          error
        );
        if (error.status === 404) {
          return throwError(ERROR_MESSAGES.NOT_FOUND);
        } else if (error.status === 400) {
          return throwError(ERROR_MESSAGES.BAD_REQUEST);
        } else {
          return throwError(ERROR_MESSAGES.GENERAL);
        }
      })
    );
  }

  public getTasksWaitingForValidationByJobIdAndProjectPhaseStep(
    jobId: number,
    projectId?: number,
    phaseId?: number,
    stepId?: number
  ): Observable<any> {
    if (!jobId) {
      throw new Error('Job ID is not defined');
    }

    // Define base url
    const url = `${this.baseUrl}/tasks/validation/verifiableByJob/${jobId}`;

    // Initialize params as an HttpParams object
    let params = new HttpParams();

    // Add projectId, phaseId, and stepId to params if they are not null
    if (projectId != null) {
      params = params.append('projectId', projectId.toString());
    }
    if (phaseId != null) {
      params = params.append('phaseId', phaseId.toString());
    }
    if (stepId != null) {
      params = params.append('stepId', stepId.toString());
    }

    return this.http.get(url, { params }).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        console.log(
          'An error occurred getting the tasks waiting for validation for job with ID: ',
          jobId,
          error
        );
        if (error.status === 404) {
          return throwError(ERROR_MESSAGES.NOT_FOUND);
        } else {
          return throwError(ERROR_MESSAGES.GENERAL);
        }
      })
    );
  }

  public validateAndStartChildTasks(taskId: number): Observable<any> {
    if (!taskId) {
      throw new Error('Task ID is not defined');
    }
    const url = `${this.baseUrl}/tasks/${taskId}/validateAndStartChildTasks/`;
    return this.http.post(url, {}).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occured validating the task ', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }

  public invalidateTask(taskId: number): Observable<any> {
    if (!taskId) {
      throw new Error('Task ID is not defined');
    }
    const url = `${this.baseUrl}/tasks/${taskId}/invalidate/`;
    return this.http.post(url, {}).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occured invalidating the task ', error);
        return throwError(ERROR_MESSAGES.GENERAL);
      })
    );
  }
}
