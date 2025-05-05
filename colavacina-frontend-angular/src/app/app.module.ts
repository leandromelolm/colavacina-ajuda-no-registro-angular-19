import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/homecomponent';
import { PlanilhaComponent } from './components/planilha/planilha.component';
import { RowComponent } from './components/row/row.component';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
import { CalendarioVacinaComponent } from './components/calendario-vacina/calendario-vacina.component';
import { EsquemaVacinaComponent } from './components/esquema-vacina/esquema-vacina.component';
import { DetalhesVacinaDialogComponent } from './components/detalhes-vacina-dialog/detalhes-vacina-dialog.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { CalendarioVacinalComponent } from './pages/calendario-vacinal/calendario-vacinal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlanilhaComponent,
    RowComponent,
    ToastMessageComponent,
    TruncatePipe,
    BottomSheetComponent,
    CalendarioVacinaComponent,
    EsquemaVacinaComponent,
    DetalhesVacinaDialogComponent,
    SobreComponent,
    CalendarioVacinalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatIconModule,
    MatChipsModule,
    MatBottomSheetModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
