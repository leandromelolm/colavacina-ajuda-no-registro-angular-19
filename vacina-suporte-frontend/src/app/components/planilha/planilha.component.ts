import { Component } from '@angular/core';
import { log } from 'console';

interface RowData {
  nomeVacina: string;
  lote: string;
  validade: string;
  checked: boolean;
  isEditMode: boolean;
  opcaoSelecionada?: string;
}

@Component({
  selector: 'app-planilha',
  standalone: false,
  templateUrl: './planilha.component.html',
  styleUrl: './planilha.component.scss'
})
export class PlanilhaComponent {

  rowCount: number = 0;
  rows: RowData[] = [];

  iconCheck: string = 'check_box_outline_blank';
  txtNomeVacina: string = '';
  txtLote: string = '';
  txtDataValidade: string = '';
  txtId: string = '';
  isEditMode: boolean = false;

  opcoes = [
    { id: '1', nome: 'D E' },
    { id: '2', nome: 'D D' },
    { id: '2', nome: 'F D' },
    { id: '2', nome: 'F E' },
    { id: '3', nome: 'V E' },
    { id: '4', nome: 'V D' },
  ];

  // opcaoSelecionada: string = 'E';

  copiedMessage: string = '';

  updateRows() {
    const saved = localStorage.getItem('planilhaData');
    console.log(saved);
    
    const rawRows = saved ? JSON.parse(saved) : [];
  
    // Garante que cada item tenha todas as propriedades esperadas
    this.rows = rawRows.map((row: Partial<RowData>) => ({
      nomeVacina: row.nomeVacina || '',
      lote: row.lote || '',
      validade: row.validade || '',
      checked: row.checked || false,
      isEditMode: false,
      opcaoSelecionada: row.opcaoSelecionada || ''
    }));
  }
  
  handleRowChange(data: any, index: number) {
    this.rows.push(data)
    localStorage.setItem('planilhaData', JSON.stringify(this.rows));
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  toggleCheck(index: number) {
    this.rows[index].checked = !this.rows[index].checked;
  }
  
  toggleEditMode2(index: number) {
    this.rows[index].isEditMode = !this.rows[index].isEditMode;
  }
  
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      localStorage.setItem('planilhaData', JSON.stringify(this.rows));
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedMessage = `Copiado: ${text}`;
      setTimeout(() => {
        this.copiedMessage = '';
      }, 2000);
    }).catch(err => {
      console.error('Erro ao copiar!', err);
    });
  }

  clearAllChecks() {
    this.rows.forEach(row => row.checked = false);
    localStorage.setItem('planilhaData', JSON.stringify(this.rows));
    this.resetTodosSelects();
  }

  resetTodosSelects() {
    this.rows.forEach(row => {
      row.opcaoSelecionada = "";
    });
  }

  async getList(id: string) {
    const url = `https://script.google.com/macros/s/AKfycbxMjZhJ8AWQzprcHV81K3Zp8WLfrz35odWb4QnS4cZ4uK4PREo4bfER26s1xx3Epndm/exec?action=list&id=${id}`;

    const response = await fetch(url);
    const data = await response.json();
    localStorage.setItem('planilhaData', JSON.stringify(data.content.vacinas));
    this.updateRows()
    console.log('Resposta:', data.content);
  }

}