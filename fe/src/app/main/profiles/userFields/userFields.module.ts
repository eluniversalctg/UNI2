import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserFieldsService } from 'src/app/shared/services';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { UserFieldsComponent } from './components/userFields.component';

// primeng modules
const modules = [SharedModule];
const routes: Routes = [
  {
    path: 'userFields',
    canActivate: [AccesGuard],
    component: UserFieldsComponent,
  },
];

@NgModule({
  providers: [UserFieldsService],
  declarations: [UserFieldsComponent],
  imports: [CommonModule, ...modules, RouterModule.forChild(routes)],
})
export class UserFieldsModule {}
