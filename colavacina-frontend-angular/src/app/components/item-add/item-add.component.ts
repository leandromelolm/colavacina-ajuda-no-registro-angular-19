import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { log } from 'console';
import { ToastMessageService } from '../../service/toast-message.service';


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

  constructor(
    private toastService: ToastMessageService
  ) {}

  ngOnInit() {}

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
    this.toastService.show({ text: 'Item adicionado!', type: 'success' });
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
  }

  verifyInput(): boolean {
    if(!this.txtNomeVacina && !this.txtLote) { 
      this.toastService.show({ text: 'Preencha os campos nome e lote!', type: 'warning' });
      return false
    }
    else 
      return true
  }

  toggleCheck() {
    this.iconCheck =  'check_box' === this.iconCheck  ? 'check_box_outline_blank' : 'check_box';
  }

}
