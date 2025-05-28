function env() {
  return {
    ENV_SPREADSHEET_ID : '',
    SHEETNAME : ''
  }
}

// Formato da string na celula

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
