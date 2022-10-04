import { NgModule } from '@angular/core';
import { AuthGuard } from './guard/auth.guard';
import { MenuService } from './services/index';
import { AccesGuard } from './guard/access.guard';
import { SharedModule } from '../shared/shared.module';

const providers = [MenuService, AuthGuard, AccesGuard];

@NgModule({
  imports: [SharedModule],
  // declarations: [...components],
  providers: [...providers],
  // exports: [...components],
})
export class CoreModule {}
