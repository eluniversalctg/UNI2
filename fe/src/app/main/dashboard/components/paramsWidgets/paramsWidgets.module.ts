import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { ParamsWidgetsService } from 'src/app/shared/services';
import { ParamsWidgetsComponent } from './paramsWidgets.component';

const routes: Routes = [
  {
    path: 'paramsWidgets',
    component: ParamsWidgetsComponent,
    canActivate: [AuthGuard, AccesGuard],
  },
];
@NgModule({
  providers: [ParamsWidgetsService],
  declarations: [ParamsWidgetsComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class DashboardModule {}
