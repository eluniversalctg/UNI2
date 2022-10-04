import {
  PagesService,
  ExportService,
  BlockService,
} from 'src/app/shared/services';
import { NgModule } from '@angular/core';
import { BlockComponent } from './blocks.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';

// primeng modules
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';

const routes: Routes = [
  {
    path: 'blocks',
    canActivate: [AccesGuard, AuthGuard],
    component: BlockComponent,
  },
];

const modules = [SharedModule, CheckboxModule, DropdownModule, ChipsModule];

@NgModule({
  providers: [PagesService, ExportService, BlockService],
  declarations: [BlockComponent],
  imports: [RouterModule.forChild(routes), ...modules],
})
export class BlocksModule {}
