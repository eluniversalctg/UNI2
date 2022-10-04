import { NgModule } from '@angular/core';
import { DomainsComponent } from './domains.component';
import { RouterModule, Routes } from '@angular/router';
import { DomainsService } from 'src/app/shared/services';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';

const routes: Routes = [
  {
    path: 'domains',
    component: DomainsComponent,
    canActivate: [AuthGuard, AccesGuard],
  },
];
@NgModule({
  providers: [DomainsService],
  declarations: [DomainsComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class DomainsModule {}
