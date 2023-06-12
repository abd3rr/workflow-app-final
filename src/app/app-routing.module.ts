import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionGridComponent } from './action-grid/action-grid.component';
import { AddPhaseComponent } from './add-phase/add-phase.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddStepComponent } from './add-step/add-step.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { SuccessCreateProjectComponent } from './success-create-project/success-create-project.component';
import { ListTasksComponent } from './list-tasks/list-tasks.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RoleGuard } from './guards/role.guard';
import { TaskListUserComponent } from './task-list-user/task-list-user.component';
import { TaskDetailUserComponent } from './task-detail-user/task-detail-user.component';
import { ValidateTaskComponent } from './validate-task/validate-task.component';
import { ValidateTaskDetailsComponent } from './validate-task-details/validate-task-details.component';
import { DashboardGridComponent } from './dashboard-grid/dashboard-grid.component';
import { TaskStatisticsComponent } from './task-statistics/task-statistics.component';
import { AddJobComponent } from './add-job/add-job.component';
import { ManageJobGridComponent } from './manage-job-grid/manage-job-grid.component';
import { ListJobsComponent } from './list-jobs/list-jobs.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UserDetailAdminComponent } from './user-detail-admin/user-detail-admin.component';
import { ManageUserGridComponent } from './manage-user-grid/manage-user-grid.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['user', 'admin'] },
      },
      {
        path: 'addProject',
        component: AddProjectComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'addPhase/:projectVals',
        component: AddPhaseComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'addStep/:projectVals/:phaseList',
        component: AddStepComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'addTask',
        component: AddTaskComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'sucessProjectAdd/:projectVals/:phaseList',
        component: SuccessCreateProjectComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'listTasks',
        component: ListTasksComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'taskDetails/:taskId',
        component: TaskDetailsComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'actionGrid',
        component: ActionGridComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'taskListUser',
        component: TaskListUserComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['user'] },
      },
      {
        path: 'taskDetailUser/:taskId',
        component: TaskDetailUserComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['user'] },
      },
      {
        path: 'validateTask',
        component: ValidateTaskComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['user', 'admin'] },
      },
      {
        path: 'validateTaskDetails/:taskId',
        component: ValidateTaskDetailsComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['user', 'admin'] },
      },
      {
        path: 'dashboardGrid',
        component: DashboardGridComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'taskStatistics',
        component: TaskStatisticsComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'addJob',
        component: AddJobComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'manageJobGrid',
        component: ManageJobGridComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'listJobs',
        component: ListJobsComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'manageUserGrid',
        component: ManageUserGridComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'listUsers',
        component: ListUsersComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'addUser',
        component: AddUserComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
      {
        path: 'userDetailAdmin/:userId',
        component: UserDetailAdminComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['admin'] },
      },
    ],
  },
  // Fallback when no prior route is matched
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
