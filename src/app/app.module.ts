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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
