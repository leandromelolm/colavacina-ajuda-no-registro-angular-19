import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav-container',
  standalone: false,
  templateUrl: './sidenav-container.component.html',
  styleUrl: './sidenav-container.component.scss'
})
export class SidenavContainerComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'ColaVacina';
  rota: string = '';

  @Input() isSmallScreen: boolean = false;

  constructor(
    private router: Router
  ) { }

  getUrlParameter(rota: string): void {
    const urlParamIdLista = localStorage.getItem('listaVacinasId');
    const queryParams = urlParamIdLista ? { d: urlParamIdLista } : {};
    this.rota = rota;
    if( rota == '/home'){
      this.router.navigate(["/"], { queryParams });
    } else {
      this.router.navigate([this.rota])
    }
  }

  closeIfMobile(): void {
    if (this.isSmallScreen) {
      this.sidenav.close();
    }
  }

}
