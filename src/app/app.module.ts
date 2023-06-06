import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ActionGridComponent } from './action-grid/action-grid.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddPhaseComponent } from './add-phase/add-phase.component';
import { AddStepComponent } from './add-step/add-step.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { SuccessCreateProjectComponent } from './success-create-project/success-create-project.component';

import { SomethingWentWrongComponent } from './something-went-wrong/something-went-wrong.component';
import { ListTasksComponent } from './list-tasks/list-tasks.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { LoginComponent } from './login/login.component';
import { AuthenticatedWrapperComponent } from './authenticated-wrapper/authenticated-wrapper.component';
import { HomeComponent } from './home/home.component';
import { TaskListUserComponent } from './task-list-user/task-list-user.component';
import { TaskDetailUserComponent } from './task-detail-user/task-detail-user.component';
import { ValidateTaskComponent } from './validate-task/validate-task.component';
import { ValidateTaskDetailsComponent } from './validate-task-details/validate-task-details.component';

import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { DashboardGridComponent } from './dashboard-grid/dashboard-grid.component';
import { TaskStatisticsComponent } from './task-statistics/task-statistics.component';
import { MatCardModule } from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TaskStatisticsWithFiltersComponent } from './task-statistics-with-filters/task-statistics-with-filters.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    ActionGridComponent,
    AddProjectComponent,
    AddPhaseComponent,
    AddStepComponent,
    AddTaskComponent,
    SuccessCreateProjectComponent,
    SomethingWentWrongComponent,
    ListTasksComponent,
    TaskDetailsComponent,
    LoginComponent,
    AuthenticatedWrapperComponent,
    HomeComponent,
    TaskListUserComponent,
    TaskDetailUserComponent,
    ValidateTaskComponent,
    ValidateTaskDetailsComponent,
    FeedbackDialogComponent,
    NotificationsComponent,

    DashboardGridComponent,
    TaskStatisticsComponent,
    TaskStatisticsWithFiltersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    HttpClientModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDialogModule,
    DatePipe,
    MatCardModule,
    NgxChartsModule,
    MatTableModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
