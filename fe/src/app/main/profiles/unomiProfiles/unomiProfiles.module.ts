import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { ExportService, UnomiProfilesService } from 'src/app/shared/services';
import { UnomiProfilesComponent } from './components/unomiProfiles.component';
import { StaticsProfileModule } from '../statistics/statistics.module';
// primeng modules
const modules = [SharedModule];
const routes: Routes = [
  {
    path: 'unomiProfiles',
    canActivate: [AccesGuard, AuthGuard],
    component: UnomiProfilesComponent,
  },
  {
    path: 'unomiProfiles/:id',
    canActivate: [AccesGuard, AuthGuard],
    component: UnomiProfilesComponent,
  },
];

@NgModule({
  providers: [UnomiProfilesService, ExportService],
  declarations: [UnomiProfilesComponent],
  imports: [
    CommonModule,
    ...modules,
    StaticsProfileModule,
    RouterModule.forChild(routes),
  ],
})
export class UnomiProfilesModule {}
