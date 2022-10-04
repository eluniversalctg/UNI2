import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppMainComponent } from './app.main.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMenuComponent } from './app.menu.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { TopbarMenuService } from './app.topbarmenu.service';
import { AppMenuitemComponent } from './app.menuitem.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTopbarMenuComponent } from './app.topbarmenu.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorService } from './core/interceptor/httpInterceptor.service';
import { CreatePlaceholderArtService } from './shared/services/createPlaceholderArt.service';

@NgModule({
  declarations: [
    AppComponent,
    AppMainComponent,
    AppMenuComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuitemComponent,
    AppTopbarMenuComponent,
  ],
  imports: [
    CoreModule,
    FormsModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    TopbarMenuService,
    CreatePlaceholderArtService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
