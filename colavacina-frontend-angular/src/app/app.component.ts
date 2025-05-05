import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'vacina-suporte-frontend';
  rota: string = '';

  isSmallScreen: boolean = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }

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

  closeIfMobile() {
    if (this.isSmallScreen) {
      this.sidenav.close();
    }
  }
}
