import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/homecomponent';
import { PlanilhaComponent } from './components/planilha/planilha.component';
import { RowComponent } from './components/row/row.component';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlanilhaComponent,
    RowComponent,
    ToastMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
