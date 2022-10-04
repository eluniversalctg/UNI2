import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { ActionsComponent } from './component/action.component';
import { ActionsService, VariableService } from 'src/app/shared/services';

// primeng modules
import { PickListModule } from 'primeng/picklist';
const routes: Routes = [
  {
    path: 'actions',
    canActivate: [AccesGuard, AuthGuard],
    component: ActionsComponent,
  },
];
const modules = [SharedModule, PickListModule];

@NgModule({
  declarations: [ActionsComponent],
  providers: [VariableService, ActionsService],
  imports: [CommonModule, RouterModule.forChild(routes), ...modules],
})
export class ActionsModule {}
