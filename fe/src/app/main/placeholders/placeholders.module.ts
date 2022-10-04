import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';
import { PlaceholdersComponent } from './components/placeholders.component';
import { PlaceholdersService } from 'src/app/shared/services/placeholders.service';
// primeng modules
import { RadioButtonModule } from 'primeng/radiobutton';

const routes: Routes = [
  {
    path: '',
    canActivate: [AccesGuard],
    children: [{ path: 'placeholders', component: PlaceholdersComponent }],
  },
];

const modules = [SharedModule, RadioButtonModule];

@NgModule({
  providers: [PlaceholdersService],
  declarations: [PlaceholdersComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class PlaceholdersModule {}
