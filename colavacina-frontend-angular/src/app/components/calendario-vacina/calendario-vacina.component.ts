import { Component } from '@angular/core';

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

  ngOnInit() {
    this.checkSessionStorage();
  }

  checkSessionStorage() {
    const vacinas = sessionStorage.getItem("esquema-vacina");
    if (vacinas) {
      console.log("vacinas Session", vacinas);
      this.exibirLista(JSON.parse(vacinas));
      this.createPopoverList(JSON.parse(vacinas));
      this.dados = JSON.parse(vacinas);
    } else {
      this.getListaVacinasDoCalendario();
    }
  }

  async getListaVacinasDoCalendario() {
    const res = await fetch('https://script.google.com/macros/s/AKfycbyLuUjtOp2eFEB34iHwptYnLgTfEDceyYAeetdSpNAFXtXLZcX-PDVy90iQElM40YQwjw/exec?action=read');
    const data = await res.json();
    sessionStorage.setItem("esquema-vacina", JSON.stringify(data.content));
    this.exibirLista(data.content);
    this.createPopoverList(data.content);
  }

  exibirLista(vacinas: any[]) {
    this.vaccines = vacinas;
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
}

