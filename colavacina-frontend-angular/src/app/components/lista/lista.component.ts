import { Component, HostListener, Inject, PLATFORM_ID, QueryList, ViewChildren } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ToastMessageService } from '../../service/toast-message.service';

interface RowData {
  nomeVacina: string;
  lote: string;
  validade: string;
  checked: boolean;
  isEditMode: boolean;
  opcaoSelecionada?: string;
}

interface LetterState {
  id: string;
  nome: string;
  descricao: string;
}

@Component({
  selector: 'app-lista',
  standalone: false,
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export class ListaComponent {

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
  anyItemEdited: boolean = false;
  copiedValue: string = '';
  copiedMessage: string = '';
  txtToastMessage: string = '';
  opcoes = [
    { id: '0', nome: '', descricao: '' }, // tooltip
    { id: '1', nome: 'D E', descricao: 'Deltoide Esquerdo' },
    { id: '4', nome: 'F E', descricao: 'Face Externa Superior Esquerdo' },
    { id: '5', nome: 'V E', descricao: 'Vasto Lateral da Coxa Esquerdo' },
    { id: '2', nome: 'D D', descricao: 'Deltoide Direito' },
    { id: '3', nome: 'F D', descricao: 'Face Externa Superior Direito' },
    { id: '6', nome: 'V D', descricao: 'Vasto Lateral da Coxa Direito' }
  ];

  // letterStates: string[] = ['-', 'BD', 'BE', 'CD', 'CE'];
  letterStates: LetterState[] = [
    { id: '0', nome: '', descricao: '' },
    { id: '1', nome: 'BD', descricao: 'Braço direito' },
    { id: '2', nome: 'BE', descricao: 'Braço esquerdo' },
    { id: '3', nome: 'CD', descricao: 'Vasto lateral da coxa direita' },
    { id: '4', nome: 'CE', descricao: 'Vasto lateral da coxa esquerdo' }
  ];
  showRow = true;
  selectedNomesVacinas: string[] = [];
  selectedLotes: string[] = [];
  isHiddenDiv: boolean = true;
  isBrowser: boolean = false;
  showFloatingButton: boolean = false;
  keyArrow: string = 'keyboard_arrow_down';

  menuHidden = false;
  private lastScrollTop = 0;
  private threshold = 15; // sensibilidade no scrool

  fabActions = [
    { icon: 'close', title: 'Desmarcar itens e limpar campos', callback: () => this.limparSelecaoItem() },
    { icon: 'edit', title: 'Editar lista', callback: () => this.editarItem() },
    { icon: 'info', title: 'Calendário de vacinação', callback: () => this.informeCalendarioVacinacao() },
    { icon: 'screen_rotation_alt', title: 'Rotacionar menu', callback: () => this.rotacionarMenu()}
  ];

  constructor(
    private bottomSheet: MatBottomSheet,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastService: ToastMessageService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.getUrl();
      this.onWindowScroll();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

    // mostrar ou esconder botão flutuante
    this.showFloatingButton = scrollTop > 30;

    // detectar direção para esconder/reexibir o menu
    const direction = scrollTop > this.lastScrollTop ? 'down' : 'up';
    if (direction === 'down' && scrollTop - this.lastScrollTop > this.threshold) {
      this.menuHidden = true;
      // console.log(direction)
    } else if (direction === 'up' && this.lastScrollTop - scrollTop > this.threshold) {
      // console.log(direction)
      this.menuHidden = false;
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  toggleMenuHidden(): boolean {
    return this.menuHidden = !this.menuHidden;
  }

  openBottomSheet(): void {
    const sheetRef = this.bottomSheet.open(BottomSheetComponent, {
      data: {id: `Lista Código:${this.listaVacinasId}`},
      panelClass: 'custom-bottom-sheet',
      restoreFocus: false
    });

    sheetRef.afterDismissed().subscribe((resultado) => {
      if (resultado) {
        console.log('Valor retornado do bottom-sheet:', resultado);
        this.handleRowChange(resultado, 0);
      }
    });
  }

  toggleLetter(index: number): void {
    const row = this.rows[index];

    // Descobre o índice atual (por id)
    const currentId = row.opcaoSelecionada ?? '0';
    const currentIdx = this.letterStates.findIndex(ls => ls.id === currentId);

    // Próximo índice (circular)
    const nextIdx = (currentIdx + 1) % this.letterStates.length;

    // Atualiza com o id do próximo estado
    row.opcaoSelecionada = this.letterStates[nextIdx].id;

    // Marca alteração se necessário
    // this.isChanged = true;
    // localStorage.setItem('planilhaData', JSON.stringify(this.rows));
  }

  getLetterState(id: string | undefined): LetterState {
    return this.letterStates.find(ls => ls.id === id) || this.letterStates[0];
  }

  onRowChangeTextArea() {
    localStorage.setItem('planilhaData', JSON.stringify(this.rows));
  }

  pegarLocalDeVacinacao(id: string | undefined): any {
    return this.opcoes.find(o => o.id === id) || this.opcoes[0];
  }
  
  onClickLote(text: string) {
    this.copyToClipboard(text);
    this.toggleSelectedLote(text);
  }

  toggleSelecionado(nomeVacina: string) {
    const index = this.selectedNomesVacinas.indexOf(nomeVacina);
    if (index === -1) {
      this.selectedNomesVacinas.push(nomeVacina);
    } else {
      this.selectedNomesVacinas.splice(index, 1);
    }
  }

  clearAllSelelectedVacina() {
    this.selectedNomesVacinas = [];
  }

  toggleSelectedLote(lote: string) {
    const idx = this.selectedLotes.indexOf(lote);
    if (idx === -1) {
      this.selectedLotes.push(lote);
    } else {
      this.selectedLotes.splice(idx, 1);
    }
  }

  clearAllSelectedLote() {
    this.selectedLotes = [];
  }

  resetTodosSelects() {
    this.copiedValue = '';
    this.rows.forEach(row => {
      row.opcaoSelecionada = "";
    });
  }

  clearAllChecks() {
    if(this.rows.length === 0)
      return this.toastService.show({ text: 'Carregue a lista antes de limpar', type: 'warning' });
    this.rows.forEach(row => row.checked = false);
    this.rows.forEach(row => row.opcaoSelecionada = "");
    localStorage.setItem('planilhaData', JSON.stringify(this.rows));
    this.resetTodosSelects();
    this.clearAllSelelectedVacina();
    this.clearAllSelectedLote();
    this.limparTodasTextareas();
  }

  limparTodasTextareas() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(t => t.value = '');
  }

  updateList() {
    this.listaVacinasId = localStorage.getItem('listaVacinasId') || '';
    const saved = localStorage.getItem('planilhaData');
    if (!saved || saved === '[]')
      return this.toastService.show({ text: 'Lista local vazia!', type: 'warning' });

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

  onRowChange(): void {
    this.anyItemEdited = true;
    // this.toastService.show({ text: 'Item editado. Salve para confirmar!', type: 'info' });
  }

  alertSaveEditLocal() {
    if(!this.anyItemEdited){
      return;
    }
    Swal.fire({
      title: `Confirma salvar edição localmente?`,
      text: 'Confirme se deseja salvar as alterações localmente.',
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
        this.saveEditLocalStorage();
        this.toastService.show({ text: 'Edição salva localmente!', type: 'success' });
        this.anyItemEdited = false;
      } else {
        this.updateList();
        this.toastService.show({ text: 'Salvamento de edição cancelado!', type: 'warning' });
        this.anyItemEdited = false;
      }
    });
  }

  toggleEditMode():void {
    this.isEditMode = !this.isEditMode;
    
    if(!this.isEditMode) {
      this.alertSaveEditLocal();
    }
  }

  saveEditLocalStorage():void {
    if(this.rows.length == 0){
      this.toastService.show({ text: 'Lista vazia!', type: 'warning' });
      return;
    }
    if (!this.isEditMode) {
      localStorage.setItem('planilhaData', JSON.stringify(this.rows));
      this.isChanged = true;
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // this.copiedMessage = `Copiado: ${text}`;
      this.toastService.show({ text: `Copiado: ${text}`, type: 'success' });
      this.copiedValue = text;
      setTimeout(() => {
        this.copiedMessage = '';
      }, 2000);
    }).catch(err => {
      console.error('Erro ao copiar!', err);
    });
  }

  downloadList(id: string) {
    console.log(id)
    if (id.length > 3)
      this.getList(id)
    else {
      this.toastService.show({ text: 'Código inválido!', type: 'error' });
    }
  } 

  async getList(id: string) {    

    const url = `https://script.google.com/macros/s/${environment.idSheetLista}/exec?action=list&id=${id}`;
    this.isLoading = true;
    try {
      const response = await fetch(url);
      const data = await response.json();
      localStorage.setItem('planilhaData', JSON.stringify(data.content.vacinas));
      localStorage.setItem('listaVacinasId', data.message);
      this.updateList()
      this.isLoading = false;
      this.isChanged = false;
      console.log('Resposta:', data.content);
      this.toastService.show({ text: 'Itens baixados com sucesso!', type: 'success' });
    } catch (error) {
      this.isLoading = false;
    }
  }

  async saveList() {

    const lista = localStorage.getItem('planilhaData');

    const data = {
      lista: lista,
      id: this.txtId,
      action: 'saveList'
    }

    this.send(data);
  }

  saveListAlert() {

    if (this.txtId === '') {
      this.toastService.show({ text: 'Preencha o campo Código!', type: 'error' });
      return;
    }

    Swal.fire({
      title: `Confirma salvar Código ${this.txtId}?`,
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
    const url = `https://script.google.com/macros/s/${environment.idSheetLista}/exec`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      const res = await response.json();
      console.log(res);
      if (res.success) {
        this.toastService.show({ text: res.message, type: 'success' });
        this.isChanged = false;
        Swal.fire('Salvo!', res.message, 'success');
      } else {
        this.toastService.show({ text: "Falha ao salvar. mensagem de erro", type: 'error' });
        
      }
    } catch (error) {
      this.toastService.show({ text: `Erro: ${error}`, type: 'error' });

    }
  }

  isSubcutanea(vacina: string): boolean {
    const subcutaneas = ["FA", "SRC", "Varicela", "SRCV"];

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
        // Swal.fire('Deletado!', 'O item foi removido.', 'success');
      }
    });
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
    localStorage.setItem('planilhaData', JSON.stringify(this.rows));
    this.isChanged = true;
    this.toastService.show({ text: 'Item deletado com sucesso.', type: 'success' });
  }

  drop(event: CdkDragDrop<RowData[]>) {
    moveItemInArray(this.rows, event.previousIndex, event.currentIndex);
    localStorage.setItem('planilhaData', JSON.stringify(this.rows));
    this.isChanged = true;
  }

  getUrl() {
    let urlParams = new URLSearchParams(window.location.search)
    let d = urlParams.get('d') || null;
    if (d){
      sessionStorage.setItem('d', d);
      localStorage.setItem('listaVacinasId', d);
      this.updateList()
    }
  }
  
  clearSessionStorage() {
    sessionStorage.clear();
  }

  windowOpen() {
    const url = `${window.location.origin}/?d=${this.listaVacinasId}`;
    const nomeJanela = 'mobileView';
    const screenHeight = window.screen.availHeight;
    const screenWidth = window.screen.availWidth; 
    const windowWidth = 375;
    const left = screenWidth - windowWidth; 
    const features = [
      `width=${windowWidth}`,
      `height=${screenHeight}`,
      'top=0',  // distância do topo da tela
      `left=${screenWidth}`, // left
      'resizable=yes',  // permite redimensionar
      'scrollbars=yes', // habilita barras de rolagem
      'toolbar=no',     // esconde barra de ferramentas
      'location=no',    // esconde barra de endereço
      'status=no',
      'menubar=no'
    ].join(',');

    window.open(url, nomeJanela, features);
  }

  moreOptions() {
    this.isHiddenDiv = !this.isHiddenDiv;
  }

  triggerFAB = () => { // Arrow Function para preservar o contexto do this
    this.openBottomSheet();
  };

  limparSelecaoItem() {
    this.clearAllChecks();
  }

  editarItem() {
    this.toggleEditMode();
  }

  informeCalendarioVacinacao() {
    this.openBottomSheet();
  }

  rotacionarMenu() {
    if(localStorage.getItem('menu-flex-direction') === "flex-direction-row")
      localStorage.setItem('menu-flex-direction', 'flex-direction-column')
    else
      localStorage.setItem('menu-flex-direction', 'flex-direction-row')
  }

}