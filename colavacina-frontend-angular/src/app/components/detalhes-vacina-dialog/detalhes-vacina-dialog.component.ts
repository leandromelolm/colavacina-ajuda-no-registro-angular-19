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

  parseJsonArray(jsonString: string): string[] {
    try {
      const result = JSON.parse(jsonString);
      if (Array.isArray(result)) {
        return result;
      } else {
        return [jsonString];
      }
    } catch (e) {
      console.error("Erro ao analisar JSON:", e);
      return [jsonString];
    }
  }

  jsonParse(o: any){
    return JSON.parse(o);
  }

}

/** 
 
FORMATO DO TEXTO NA CELULA QUANDO FOR OBJETO:
{
  "Obs1": "Poderá ser substituida pelas vacinas Tríplice Viral + Varicela Atenuada;",
  "Obs2": "Prevenção da varicela e suas complicações;",
  "Obs3": "Esquema básico: recomenda-se administrar 1 dose aos 4 anos de idade.;"
}

FORMATO DO TEXTO NA CELULA QUANDO FOR ARRAY:
[
  "A vacina protege contra o Sarampo, Caxumba e Rubéola (Tríplice viral)",
  "A vacina não pode ser feita simuntaneamente com a vacina da febre amarela"
]
  
*/
