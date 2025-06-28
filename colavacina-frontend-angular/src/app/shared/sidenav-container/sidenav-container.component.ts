import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
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
  @Input() isSmallScreen: boolean = false;
  title = 'ColaVacina';
  rota: string = '';
  showFloatingButton = false;
  isBrowser: boolean;

  @ViewChild('contentContainer') contentContainer!: ElementRef;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(this.platformId);
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

  closeIfMobile(): void {
    if (this.isSmallScreen) {
      this.sidenav.close();
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.onWindowScroll();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      this.showFloatingButton = this.isSmallScreen && scrollTop > 180;
    }
  }

  toggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
  }

}
