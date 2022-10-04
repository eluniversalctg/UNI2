import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WidgetsComponent } from './widgets.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { ParamsWidgetsService, WidgetsService } from 'src/app/shared/services';

const routes: Routes = [
  {
    path: 'widgets',
    component: WidgetsComponent,
    canActivate: [AuthGuard, AccesGuard],
  },
];
@NgModule({
  providers: [WidgetsService, ParamsWidgetsService],
  declarations: [WidgetsComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class WidgetsModule {}
