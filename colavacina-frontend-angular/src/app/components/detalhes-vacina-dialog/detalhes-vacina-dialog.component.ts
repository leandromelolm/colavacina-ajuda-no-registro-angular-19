import { Component, Inject } from '@angular/core';
import { VacinaCompleta } from '../../service/vacina.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detalhes-vacina-dialog',
  standalone: false,
  templateUrl: './detalhes-vacina-dialog.component.html',
  styleUrl: './detalhes-vacina-dialog.component.scss'
})
export class DetalhesVacinaDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public vacina: VacinaCompleta) {}

}
