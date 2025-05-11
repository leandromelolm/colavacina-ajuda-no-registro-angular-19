import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrupoVacinas, VacinaCompleta, VacinaService } from '../../service/vacina.service';
import { DetalhesVacinaDialogComponent } from '../detalhes-vacina-dialog/detalhes-vacina-dialog.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-calendario-vacina',
  standalone: false,
  templateUrl: './calendario-vacina.component.html',
  styleUrl: './calendario-vacina.component.scss'
})
export class CalendarioVacinaComponent {

  vaccines: any[] = [];
  popoverListHtml: string = '';
  dados:  any[] = [];

  vacinas: VacinaCompleta[] = []; // Preencha com seus dados
  vacinasOrdenadaPorIdade: VacinaCompleta[] = []; // Preencha com seus dados
  gruposVacinas: GrupoVacinas[] = [];
  faixasDisponiveis: string[] = ['Criança', 'Adolescente', 'Adulto', 'Idoso', 'Gestante'];
  faixaSelecionada: string = 'Criança';
  informacoes_vacina: SafeHtml = '';
  tituloGrupo: string = "";
  isBrowser: boolean;

  constructor(
    private vacinaService: VacinaService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.checkSessionStorage();
    this.getInformesVacina();
  }

  checkSessionStorage(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) { // também funciona usar o this.isBrowser
      const vacinas = sessionStorage.getItem("esquema-vacina");
      if (!vacinas) {
        this.getListaVacinasDoCalendario();
      } else {
        console.log("vacinas Session", vacinas);
        this.exibirLista(JSON.parse(vacinas));
        this.vacinas = JSON.parse(vacinas);
        this.carregartabela(this.vacinas);
      }
    }
  }

  async getInformesVacina() {
    if (this.isBrowser) {
      const informes = sessionStorage.getItem('vacinacao_informes');
      if(!informes) {
        const res = await fetch(`https://script.google.com/macros/s/${environment.idSheetInforme}/exec?action=informes`)
        const data = await res.json();
        sessionStorage.setItem('vacinacao_informes', data.content[0].informe);
        this.informacoes_vacina = this.sanitizer.bypassSecurityTrustHtml(data.content[0].informe);  
      } else{
        this.informacoes_vacina = this.sanitizer.bypassSecurityTrustHtml(informes);
      }
    }
  }

  async getListaVacinasDoCalendario() {
    const res = await fetch(`https://script.google.com/macros/s/${environment.idSheetCalendarioVacinas}/exec?action=read`);
    const data = await res.json();
    sessionStorage.setItem("esquema-vacina", JSON.stringify(data.content));
    this.vacinas = data.content;
    this.carregartabela(data.content);    
  }

  carregartabela(data: any) {
    this.vacinasOrdenadaPorIdade = this.ordenarPorGrupo(data);
    this.filtrarPorGrupoEtario(this.faixaSelecionada);
  }

  exibirLista(vacinas: any[]) {
    this.vaccines = vacinas;
  }

  filtrarPorGrupoEtario(filtroSelecionado: string) {
    console.log(filtroSelecionado);
    this.tituloGrupo = filtroSelecionado;
    this.faixaSelecionada = filtroSelecionado;
    this.dados = this.vacinasOrdenadaPorIdade.filter(vacina => vacina.faixa === filtroSelecionado);
    console.log(this.dados);
    this.exibirLista(this.dados);
    // if(filtroSelecionado === 'Criança'){
    this.gruposVacinas = this.vacinaService.agruparPorIdade(this.dados);
    // }
  }

  centralizarTagSelecionada(buttonElement: HTMLElement) {
    const container = buttonElement.parentElement;
    console.log(buttonElement);    
    if (container) {
      const containerWidth = container.clientWidth;
      const buttonOffsetLeft = buttonElement.offsetLeft;
      const buttonWidth = buttonElement.offsetWidth;
  
      const scrollTo = buttonOffsetLeft - (containerWidth / 2) + (buttonWidth / 2);
      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  }

  ordenarPorGrupo(vacinas: any): any {
    return [...vacinas].sort((a, b) => {
      const grupoA = this.grupoParaNumero(a.grupo);
      const grupoB = this.grupoParaNumero(b.grupo);
      return grupoA - grupoB;
    });
  }

  private grupoParaNumero(grupo: string): number {
    const [ano, mes] = grupo.split(',').map(Number);
    return ano * 12 + mes;
  }

  abrirDetalhes(vacina: VacinaCompleta) {
    console.log('dialog')
    this.dialog.open(DetalhesVacinaDialogComponent, {
      data: vacina,
    });
  }

}

