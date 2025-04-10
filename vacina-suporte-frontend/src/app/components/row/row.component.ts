import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-row',
  standalone: false,
  templateUrl: './row.component.html',
  styleUrl: './row.component.scss'
})
export class RowComponent {
  @Input() data: string[] = [];  
  isEditMode: boolean = false;
  inputLote: string = '';
  inputDataValidade: string = '';

  updateCell(index: number, newValue: string) {
    if (!this.isEditMode) {
      if (index >= 0 && index < this.data.length) {
        this.data[index] = newValue;
      }
    }
  }

  toggleEditMode() {
    console.log( "edi")
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode && this.data) {
      if(this.data.length > 3) this.data[3] = this.inputLote;
      if(this.data.length > 4) this.data[4] = this.inputDataValidade;
    }
  }

}
