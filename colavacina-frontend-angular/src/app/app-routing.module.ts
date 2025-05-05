import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/homecomponent';
import { SobreComponent } from './pages/sobre/sobre.component';
import { CalendarioVacinalComponent } from './pages/calendario-vacinal/calendario-vacinal.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'calendario-vacinal', component: CalendarioVacinalComponent },
  { path: 'sobre', component: SobreComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
