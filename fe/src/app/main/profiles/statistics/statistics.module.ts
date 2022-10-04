import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { StatisticsComponent } from './components/statistics.component';
import { ExportService, UnomiProfilesService } from 'src/app/shared/services';

const routes: Routes = [
  {
    path: 'profilesStatistics',
    canActivate: [AccesGuard, AuthGuard],
    component: StatisticsComponent,
  },
];

const modules = [SharedModule];
@NgModule({
  providers: [UnomiProfilesService, ExportService],
  declarations: [StatisticsComponent],
  imports: [CommonModule, ...modules, RouterModule.forChild(routes)],
  exports: [StatisticsComponent],
})
export class StaticsProfileModule {}
