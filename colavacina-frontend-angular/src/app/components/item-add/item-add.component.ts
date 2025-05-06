import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { log } from 'console';


@Component({
  selector: 'app-item-add',
  standalone: false,
  templateUrl: './item-add.component.html',
  styleUrl: './item-add.component.scss'
})
export class ItemAddComponent {

  @Input() index!: number;
  @Output() dataChanged = new EventEmitter<any>();

  @Input() rowData: any = {};
  @Input() isEditMode: boolean = true;

  iconCheck: string = 'check_box_outline_blank';
  txtNomeVacina: string = '';
  txtLote: string = '';
  txtDataValidade: string = '';
  add: boolean = false;

  copiedMessage: string = '';

  // ngOnInit() {
  //   if (this.rowData) {
  //     console.log(this.rowData)
  //     this.txtNomeVacina = this.rowData.nomeVacina || '';
  //     this.txtLote = this.rowData.lote || '';
  //     this.txtDataValidade = this.rowData.validade || '';
  //   }
  // }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    if (changes['rowData'] && this.rowData) {
      this.txtNomeVacina = this.rowData.nomeVacina || '';
      this.txtLote = this.rowData.lote || '';
      this.txtDataValidade = this.rowData.validade || '';
    }
  }

  emitData() {
    this.dataChanged.emit({
      nomeVacina: this.txtNomeVacina,
      lote: this.txtLote,
      validade: this.txtDataValidade || "-",
      checked: false,
      isEditMode: false
    });

  }

  cleanInput() {
    this.txtNomeVacina = '';
    this.txtLote = '';
    this.txtDataValidade = '';
  }

  toggleEditMode() {
    this.add = !this.add;

    if(this.verifyInput()){
      this.emitData();
      this.cleanInput();
    }

    // this.isEditMode = !this.isEditMode;
    // if (!this.isEditMode) { }
  }

  verifyInput(): boolean {
    if(this.txtNomeVacina && this.txtLote) return true
    else return false
  }

  toggleCheck() {
    this.iconCheck =  'check_box' === this.iconCheck  ? 'check_box_outline_blank' : 'check_box';

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

}
