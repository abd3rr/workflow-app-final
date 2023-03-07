import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionGridComponent } from './action-grid/action-grid.component';
import { AddPhaseComponent } from './add-phase/add-phase.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddStepComponent } from './add-step/add-step.component';

const routes: Routes = [
  { path: 'actionGrid', component: ActionGridComponent },
  { path: 'addProject', component: AddProjectComponent },
  { path: 'addPhase/:projectVals', component: AddPhaseComponent },
  { path: 'addStep/:projectVals/:phaseList', component: AddStepComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
