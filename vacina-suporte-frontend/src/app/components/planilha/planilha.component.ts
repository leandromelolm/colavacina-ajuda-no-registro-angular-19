import { Component } from '@angular/core';

interface RowData {
  nomeVacina: string;
  lote: string;
  validade: string;
  checked: boolean;
  isEditMode: boolean;
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
  isEditMode: boolean = false;

  copiedMessage: string = '';

  updateRows() {
    const saved = localStorage.getItem('planilhaData');
    const rawRows = saved ? JSON.parse(saved) : [];
  
    // Garante que cada item tenha todas as propriedades esperadas
    this.rows = rawRows.map((row: Partial<RowData>) => ({
      nomeVacina: row.nomeVacina || '',
      lote: row.lote || '',
      validade: row.validade || '',
      checked: row.checked || false,
      isEditMode: false
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
  }

}
