import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { config } from '../config/config';

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
    const url = `${this.baseUrl}projects`;
    const body = { projectName, description };
    return this.http.post(url, body).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred creating the project:', error);
        return throwError('Something went wrong; please try again later.');
      })
    );
  }

  public getProjectIdByName(projectName: string): Observable<any> {
    const url = `${this.baseUrl}projects/idByName?projectName=${projectName}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred getting the project ID by Name:', error);
        return throwError('Something went wrong; please try again later.');
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
    const url = `${this.baseUrl}phases/projects/${projectId}`;
    return this.http.post(url, body).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred creating the phase:', error);
        return throwError('Something went wrong; please try again later.');
      })
    );
  }
  // public createPhase(
  //   projectId: string,
  //   phaseName: string,
  //   description: string | null
  // ): Observable<any> {
  //   if (!projectId) {
  //     throw new Error('Project ID is not defined');
  //   }
  //   const body = { phaseName, description };
  //   const url = `${this.baseUrl}phases/projects/${projectId}`;
  //   return this.http.post(url, body).pipe(
  //     retry(3),
  //     catchError((error) => {
  //       console.log('An error occurred creating the phase:', error);
  //       this.deleteProject(projectId).subscribe(
  //         () => {
  //           console.log('Project deleted successfully.');
  //         },
  //         (deleteError) => {
  //           console.error('Error deleting project:', deleteError);
  //         }
  //       );
  //       return throwError('Something went wrong; please try again later.');
  //     })
  //   );
  // }

  public createStep(
    phaseId: string,
    stepName: string,
    description: string | null
  ): Observable<any> {
    if (!phaseId) {
      throw new Error('Phase ID is not defined');
    }
    const body = { stepName, description };
    const url = `${this.baseUrl}steps/phases/${phaseId}`;
    return this.http.post(url, body).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occured creating the step: ', error);
        return throwError('Something went wrong; please try again later.');
      })
    );
  }

  public getPhaseIdByNameAndProjectName(
    phaseName: string,
    ProjectName: string
  ): Observable<any> {
    const url = `${this.baseUrl}phases/idByNameAndProjectName?phaseName=${phaseName}&projectName=${ProjectName}`;
    return this.http.get(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred getting the phase ID:', error);
        return throwError('Something went wrong; please try again later.');
      })
    );
  }

  public deleteProject(projectId: string): Observable<any> {
    const url = `${this.baseUrl}projects/${projectId}`;
    return this.http.delete(url).pipe(
      retry(3),
      catchError((error) => {
        console.log('An error occurred deleting the phase:', error);
        return throwError('Something went wrong; please try again later.');
      })
    );
  }
}
