import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { VariablesComponent } from './components/variables.component';
import { VariableService } from 'src/app/shared/services/variable.service';
// primeng modules
import { ChipsModule } from 'primeng/chips';
import { RadioButtonModule } from 'primeng/radiobutton';

const modules = [SharedModule, RadioButtonModule, ChipsModule];
const routes: Routes = [
  {
    path: 'variables',
    canActivate: [AccesGuard],
    component: VariablesComponent,
  },
];

@NgModule({
  providers: [VariableService],
  declarations: [VariablesComponent],
  imports: [CommonModule, ...modules, RouterModule.forChild(routes)],
})
export class VariablesModule {}
