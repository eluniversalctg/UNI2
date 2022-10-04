import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/shared/services';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { CreateUserComponent } from './components/createUser.component';
// primeng modules
import { PasswordModule } from 'primeng/password';

const routes: Routes = [
  {
    path: '',
    canActivate: [AccesGuard],
    component: CreateUserComponent,
  },
];
const modules = [SharedModule, PasswordModule];
@NgModule({
  providers: [UserService],
  declarations: [CreateUserComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ...modules],
})
export class CreateUserModule {}
