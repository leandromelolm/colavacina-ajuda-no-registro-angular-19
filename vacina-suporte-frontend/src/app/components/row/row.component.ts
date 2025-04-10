import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-row',
  standalone: false,
  templateUrl: './row.component.html',
  styleUrl: './row.component.scss'
})
export class RowComponent {
  iconCheck: string = 'check_box_outline_blank';
  isEditMode: boolean = true;
  txtNomeVacina: string = '';
  txtLote: string = '';
  txtDataValidade: string = '';

  copiedMessage: string = '';

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  toggleCheck() {
    this.iconCheck =  'check_box' === this.iconCheck  ? 'check_box_outline_blank' : 'check_box';

  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedMessage = `Copiado: ${text}`;
      setTimeout(() => {
        this.copiedMessage = '';
      }, 2000); // Esconde após 2 segundos
    }).catch(err => {
      console.error('Erro ao copiar!', err);
    });
  }

}
