import { Component, HostListener } from '@angular/core';
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
  listaVacinasId: string = '';
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isChanged: boolean = false;
  copiedValue: string = "";
  copiedMessage: string = '';
  txtToastMessage: string = '';
  opcoes = [
    { id: '0', nome: '', descricao: '' }, // tooltip
    { id: '1', nome: 'D E', descricao: 'Deltoide Esquerdo' },
    { id: '2', nome: 'D D', descricao: 'Deltoide Direito' },
    { id: '3', nome: 'F D', descricao: 'Face Externa Superior Direito' },
    { id: '4', nome: 'F E', descricao: 'Face Externa Superior Esquerdo' },
    { id: '5', nome: 'V E', descricao: 'Vasto Lateral Esquerdo' },
    { id: '6', nome: 'V D', descricao: 'Vasto Lateral Direito' },
  ];

  letterStates: string[] = ['-', 'E', 'D'];
  showRow = true;

  toggleLetter(index: number): void {
    const row = this.rows[index];
    const current = row.opcaoSelecionada || '-';
    const nextIndex = (this.letterStates.indexOf(current) + 1) % this.letterStates.length;
    row.opcaoSelecionada = this.letterStates[nextIndex];
    // persiste a alteração
    // localStorage.setItem('planilhaData', JSON.stringify(this.rows));
    // this.isChanged = true;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showRow = window.pageYOffset === 0;
  }

  updateRows() {
    this.listaVacinasId = localStorage.getItem('listaVacinasId') || '';
    const saved = localStorage.getItem('planilhaData');
    console.log(saved);

    const rawRows = saved ? JSON.parse(saved) : [];

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
    this.handleRowChangeFirstList(data, index);
  }

  handleRowChangeEndList(data: any, index: number) {
    this.rows.push(data)
    localStorage.setItem('planilhaData', JSON.stringify(this.rows));
    this.isChanged = true;
  }

  handleRowChangeFirstList(data: RowData, index: number) {
    this.rows = [ data, ...this.rows ];
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
      this.copiedValue = text;
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

  downloadList(id: string) {
    console.log(id)
    if (id.length > 3)
      this.getList(id)
    else
      this.messageToast('Id inválido')
  } 

  async getList(id: string) {    

    const url = `https://script.google.com/macros/s/AKfycbxMjZhJ8AWQzprcHV81K3Zp8WLfrz35odWb4QnS4cZ4uK4PREo4bfER26s1xx3Epndm/exec?action=list&id=${id}`;
    this.isLoading = true;
    try {
      const response = await fetch(url);
      const data = await response.json();
      localStorage.setItem('planilhaData', JSON.stringify(data.content.vacinas));
      localStorage.setItem('listaVacinasId', data.message);
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
      this.messageToast('Preencha o campo id');
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
    this.txtToastMessage = `${textMessage}`;
    setTimeout(() => {
      this.txtToastMessage = '';
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

  windowOpen() {
    const url = 'https://colavacina.web.app';
    const nomeJanela = 'mobileView';
    const features = [
      'width=375',           // largura típica de um iPhone SE em px
      'height=667',          // altura típica
      'top=100',             // distância do topo da tela
      'right=0',
      'resizable=yes',       // permite redimensionar
      'scrollbars=yes',      // habilita barras de rolagem
      'toolbar=no',          // esconde barra de ferramentas
      'location=no',         // esconde barra de endereço
      'status=no',
      'menubar=no'
    ].join(',');

    window.open(url, nomeJanela, features);
  }

}