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
import { ListaComponent } from './components/lista/lista.component';
import { ItemAddComponent } from './components/item-add/item-add.component';
import { ToastMessageComponent } from './shared/toast-message/toast-message.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
import { CalendarioVacinaComponent } from './components/calendario-vacina/calendario-vacina.component';
import { DetalhesVacinaDialogComponent } from './components/detalhes-vacina-dialog/detalhes-vacina-dialog.component';
import { AboutComponent } from './pages/about/about';
import { VaccinesComponent } from './pages/vaccines/vaccines.component';
import { SidenavContainerComponent } from './shared/sidenav-container/sidenav-container.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListaComponent,
    ItemAddComponent,
    ToastMessageComponent,
    TruncatePipe,
    BottomSheetComponent,
    CalendarioVacinaComponent,
    DetalhesVacinaDialogComponent,
    AboutComponent,
    VaccinesComponent,
    SidenavContainerComponent
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
