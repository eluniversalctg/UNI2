import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { RolesComponent } from './components/roles.component';

// primeng modules
import { TreeModule } from 'primeng/tree';
const modules = [SharedModule, TreeModule];
const routes: Routes = [
  {
    path: '',
    canActivate: [AccesGuard],
    children: [{ path: 'roles', component: RolesComponent }],
  },
];
@NgModule({
  declarations: [RolesComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class RolesModule {}
