import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsComponent } from './tags.component';
import { UserService } from 'src/app/shared/services';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccesGuard } from 'src/app/core/guard/access.guard';

const routes: Routes = [
  {
    path: 'tags',
    canActivate: [AccesGuard],
    component: TagsComponent,
  },
];
@NgModule({
  providers: [UserService],
  declarations: [TagsComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class TagsModule {}
