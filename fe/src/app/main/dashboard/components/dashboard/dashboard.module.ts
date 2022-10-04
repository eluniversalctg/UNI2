import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WidgetsService } from 'src/app/shared/services';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// primeNg modules
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, AccesGuard],
  },
];

const modules = [
  FormsModule,
  SharedModule,
  CalendarModule,
  RadioButtonModule,
  OverlayPanelModule,
  ReactiveFormsModule,
];
@NgModule({
  providers: [WidgetsService],
  declarations: [DashboardComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class DashboardModule {}
