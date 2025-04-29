import { Component } from '@angular/core';
import { log } from 'console';

@Component({
  selector: 'app-calendario-vacina',
  standalone: false,
  templateUrl: './calendario-vacina.component.html',
  styleUrl: './calendario-vacina.component.scss'
})
export class CalendarioVacinaComponent {

  vaccines: any[] = [];

  ngOnInit() {
    this.checkSessionStorage();
  }

  checkSessionStorage() {
    const vacinas = sessionStorage.getItem("esquema-vacina");
    console.log("vacinas", vacinas);
    if (vacinas) {
      this.exibirLista(JSON.parse(vacinas));
    } else {
      this.getListaVacinasDoCalendario();
    }
  }

  async getListaVacinasDoCalendario() {
    const res = await fetch('https://script.google.com/macros/s/AKfycbyLuUjtOp2eFEB34iHwptYnLgTfEDceyYAeetdSpNAFXtXLZcX-PDVy90iQElM40YQwjw/exec?action=read');
    const data = await res.json();
    sessionStorage.setItem("esquema-vacina", JSON.stringify(data.content));
    this.exibirLista(data.content);
  }

  exibirLista(vacinas: any[]) {
    this.vaccines = vacinas;
  }
}

