import { Injectable } from '@angular/core';

export interface VacinaCompleta {
  id: number;
  vacina: string;
  vacina_sigla: string;
  dose: string;
  idade_ano_minimo: number;
  idade_mes_minimo: number;
  idade_ano_maximo: string;
  idade_mes_maximo: string;
  faixa: string;
  categoria: string;
  grupo_de_atendimento: string;
  grupo: string;
  observacao: string;
  informacoes_complementares: string;
  via_de_administracao: string;
  local_de_administracao: string;
  lote: string;
  validade: string;
}

export interface GrupoVacinas {
  idade_ano: number;
  idade_mes: number;
  vacinas: VacinaCompleta[];
}

@Injectable({
  providedIn: 'root'
})
export class VacinaService {

  constructor() {}

  agruparVacinasPorFaixa(vacinas: VacinaCompleta[], faixa: string): GrupoVacinas[] {
    const filtradas = this.filtrarPorFaixa(vacinas, faixa);
    return this.agruparPorIdade(filtradas);
  }

  filtrarPorFaixa(vacinas: VacinaCompleta[], faixa: string): VacinaCompleta[] {
    return vacinas.filter(v => v.faixa.toLowerCase() === faixa.toLowerCase());
  }

  agruparPorIdade(vacinas: VacinaCompleta[]): GrupoVacinas[] {
    const mapa = new Map<string, GrupoVacinas>();

    vacinas.forEach(vacina => {
      const chave = `${vacina.idade_ano_minimo}-${vacina.idade_mes_minimo}`;
      if (!mapa.has(chave)) {
        mapa.set(chave, {
          idade_ano: vacina.idade_ano_minimo,
          idade_mes: vacina.idade_mes_minimo,
          vacinas: []
        });
      }
      mapa.get(chave)?.vacinas.push(vacina);
    });

    // Ordenar grupos por idade (ano + mês)
    return Array.from(mapa.values()).sort((a, b) => {
      const idadeA = a.idade_ano * 12 + a.idade_mes;
      const idadeB = b.idade_ano * 12 + b.idade_mes;
      return idadeA - idadeB;
    });
  }
  
}
