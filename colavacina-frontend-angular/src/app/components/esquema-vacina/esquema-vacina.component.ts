import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-esquema-vacina',
  standalone: false,
  templateUrl: './esquema-vacina.component.html',
  styleUrls: ['./esquema-vacina.component.scss']
})
export class EsquemaVacinaComponent {

  dados: any[] = [];
  idadeSelecionada: string = "-";
  idades = [
    { label: 'Recém-nascido', valor: '0,0' },
    { label: '2 meses', valor: '0,2' },
    { label: '3 meses', valor: '0,3' },
    { label: '4 meses', valor: '0,4' },
    { label: '5 meses', valor: '0,5' },
    { label: '6 meses', valor: '0,6' },
    { label: '7 meses', valor: '0,7' },
    { label: '9 meses', valor: '0,9' },
    { label: '1 ano', valor: '1,0' },
    { label: '1 ano 3 meses', valor: '1,3' },
    { label: '4 anos', valor: '4,0' },
    { label: '5 anos', valor: '5,0' },
    { label: '9 anos', valor: '9,0' }
  ];
  popoverListHtml: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const saved = sessionStorage.getItem('esquema-vacina');
    if (!saved) {
      this.getLista();
    } else {
      this.dados = JSON.parse(saved);
      this.createPopoverList(this.dados);
    }
  }

  getLista() {
    this.http.get<any>('https://script.google.com/macros/s/AKfycbyLuUjtOp2eFEB34iHwptYnLgTfEDceyYAeetdSpNAFXtXLZcX-PDVy90iQElM40YQwjw/exec?action=read')
      .subscribe(res => {
        this.dados = res.content;
        sessionStorage.setItem('esquema-vacina', JSON.stringify(this.dados));
        this.createPopoverList(this.dados);
      });
  }

  atualizar() {
    sessionStorage.removeItem('esquema-vacina');
    this.getLista();
  }

  filtrar(faixa: string) {
    let result = this.dados;
    if (faixa !== 'Todos') {
      result = this.dados.filter(v => v.faixa === faixa);
    }
    if (faixa === 'Criança') {
      document.getElementById('selectIdade')?.classList.remove('d__none');
    } else {
      document.getElementById('selectIdade')?.classList.add('d__none');
    }
    this.createPopoverList(result);
  }

  filtrarPorIdade() {
    if (this.idadeSelecionada === '-') return;
    const [ano, mes] = this.idadeSelecionada.split(',').map(Number);
    const filtrado = this.dados.filter(e => e.faixa === 'Criança' && e.idade_ano_minimo === ano && e.idade_mes_minimo === mes);
    this.createPopoverList(filtrado);
  }

  createPopoverList(lista: any[]) {
    const list = lista.map(e => `
      <a tabindex="0"
        class="btn btn-sm btn-outline my-1 btn__${e.id.toString().substr(0, 1)}"
        data-bs-toggle="popover"
        data-bs-title="${e.vacina}  ${e.dose}"
        data-bs-html="true"
        data-bs-trigger="focus"
        data-bs-content="
          <div>
            <strong>Observação:</strong> ${e.observacao}<br>
            <strong>Informações:</strong> ${e.informacoes_complementares}<br>
            <strong>Via:</strong> ${e.via_de_administracao}<br>
            <strong>Local:</strong> ${e.local_de_administracao}<br>
            ${e.lote}<br>
            ${e.validade}
          </div>"
      >${e.vacina} | ${e.dose}</a>`).join('');

    this.popoverListHtml = list;
  }
}
