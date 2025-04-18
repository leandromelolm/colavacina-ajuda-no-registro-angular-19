import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';

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
  isLoading: boolean = false;
  isChanged: boolean = false;

  opcoes = [
    { id: '1', nome: 'D E', descricao: 'Deltoide Esquerdo' }, // tooltip
    { id: '2', nome: 'D D', descricao: 'Deltoide Direito' },
    { id: '3', nome: 'F D', descricao: 'Face Externa Superior Direito' },
    { id: '4', nome: 'F E', descricao: 'Face Externa Superior Esquerdo' },
    { id: '5', nome: 'V E', descricao: 'Vasto Lateral Esquerdo' },
    { id: '6', nome: 'V D', descricao: 'Vasto Lateral Direito' },
  ];

  // opcaoSelecionada: string = 'E';

  copiedMessage: string = '';
  toastMessage: string = '';

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
    this.isChanged = true;
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
      this.isChanged = true;
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
    this.isLoading = true;
    try {
      const response = await fetch(url);
      const data = await response.json();
      localStorage.setItem('planilhaData', JSON.stringify(data.content.vacinas));
      this.updateRows()
      this.isLoading = false;
      this.isChanged = false;
      console.log('Resposta:', data.content);
    } catch (error) {
      this.isLoading = false;
    }
  }

  async saveList() {

    const lista = localStorage.getItem('planilhaData');

    if (this.txtId === '') {
      this.messageToast('Preencha o campo id')
      return
    }

    const data = {
      lista: lista,
      id: this.txtId,
      action: 'saveList'
    }

    this.send(data);
  }

  saveListAlert() {
    Swal.fire({
      title: `Confirma salvar ID ${this.txtId}?`,
      text: 'Confirme se deseja salvar as alterações.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, salvar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn__confirm',
        cancelButton: 'btn__cancel'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveList();
      } else {
        console.log('Salvamento cancelado.');
      }
    });
  }

  async send(data: any) {
    const url = `https://script.google.com/macros/s/AKfycbxMjZhJ8AWQzprcHV81K3Zp8WLfrz35odWb4QnS4cZ4uK4PREo4bfER26s1xx3Epndm/exec`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      const res = await response.json();
      console.log(res);
      if (res.success) {
        this.messageToast(res.message)
        this.isChanged = false;
        Swal.fire('Salvo!', res.message, 'success');
      } else {
        this.messageToast(`Falha ao salvar. mensagem de erro: ${res.error}`);
      }
    } catch (error) {
      this.messageToast(`Erro: ${error}`);
    }
  }

  messageToast(textMessage: string) {
    this.toastMessage = `${textMessage}`;
    setTimeout(() => {
      this.toastMessage = '';
    }, 5000);
  }

  isSubcutanea(vacina: string): boolean {
    const subcutaneas = ["FA", "SRC", "Varicela"];

    const palavras = vacina
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^\w\s]/gi, '') // remove pontuação
      .split(/\s+/); // divide por espaços

    return subcutaneas.some(v => palavras.includes(v));
  }

  confirmDelete(index: number, nomeVacina: string) {
    Swal.fire({
      title: `Apagar o item ${nomeVacina}?`,
      text: 'Este item será removido permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn__confirm',
        cancelButton: 'btn__cancel'
      },
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteRow(index);
        Swal.fire('Deletado!', 'O item foi removido.', 'success');
      }
    });
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
    localStorage.setItem('planilhaData', JSON.stringify(this.rows));
    this.isChanged = true;
    this.messageToast('Item deletado com sucesso.');
  }

  drop(event: CdkDragDrop<RowData[]>) {
    moveItemInArray(this.rows, event.previousIndex, event.currentIndex);
    localStorage.setItem('planilhaData', JSON.stringify(this.rows));
    this.isChanged = true;
  }

}