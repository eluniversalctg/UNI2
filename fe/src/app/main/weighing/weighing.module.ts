import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { WeighingComponent } from './components/weighing.component';
import { WeighingService } from 'src/app/shared/services';
// primeng modules
import { RadioButtonModule } from 'primeng/radiobutton';

const routes: Routes = [
  {
    path: '',
    canActivate: [AccesGuard],
    children: [{ path: 'weighing', component: WeighingComponent }],
  },
];

const modules = [SharedModule, RadioButtonModule];

@NgModule({
  providers: [WeighingService],
  declarations: [WeighingComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class WeighingModule {}
