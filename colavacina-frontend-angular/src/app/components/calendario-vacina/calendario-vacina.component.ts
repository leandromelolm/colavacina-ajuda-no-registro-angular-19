import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrupoVacinas, VacinaCompleta, VacinaService } from '../../service/vacina.service';
import { DetalhesVacinaDialogComponent } from '../detalhes-vacina-dialog/detalhes-vacina-dialog.component';

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

  faixasDisponiveis: string[] = ['Criança', 'Adolescente', 'Adulto', 'Idoso'];
  faixaSelecionada: string = 'Criança';

  constructor(
    private vacinaService: VacinaService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.checkSessionStorage();
  }

  checkSessionStorage() {
    const vacinas = sessionStorage.getItem("esquema-vacina");
    if (vacinas) {
      console.log("vacinas Session", vacinas);
      this.exibirLista(JSON.parse(vacinas));
      this.vacinas = JSON.parse(vacinas);
      this.carregartabela(this.vacinas);
    } else {
      this.getListaVacinasDoCalendario();
    }
  }

  async getListaVacinasDoCalendario() {
    const res = await fetch('https://script.google.com/macros/s/AKfycbyLuUjtOp2eFEB34iHwptYnLgTfEDceyYAeetdSpNAFXtXLZcX-PDVy90iQElM40YQwjw/exec?action=read');
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
    this.dados = this.vacinasOrdenadaPorIdade.filter(vacina => vacina.faixa === filtroSelecionado);
    console.log(this.dados);
    this.exibirLista(this.dados);
    // if(filtroSelecionado === 'Criança'){
      this.gruposVacinas = this.vacinaService.agruparPorIdade(this.dados);
    // }
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

