# ColaVacina

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.7.


## Deploy firebase


```bash
npm install firebase
```

```bash
npm install -g firebase-tools
```

```bash
firebase login
```

```bash
firebase logout
```

```bash
firebase init
```
selecionar as opções
```bash
App Hosting
```
copiar codigo para firebase.json
```bash
{
  "hosting": {
    "site": "colavacina",
    "public": "dist/vacina-suporte-frontend/browser",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

```
executar build
```bash
ng build
```
fazer o deploy no firebase
```bash
firebase deploy --only hosting
```

```bash

```

## Git Comandos

git  | Comando
-------: | --------
pull de branch diferente   | `git pull origin main`
logs resumidos             | `git log --oneline`
_                          | `-`
_                          | `-`
listar os projetos no firebase                         | `firebase projects:list`
alterar para outro projeto existente                   | `firebase use --add PROJECT_ID`
_                          | `-`
_                          | `-`


## Formato da string na celula

```json
// FORMATO DO TEXTO NA CELULA QUANDO FOR OBJETO:
{
  "Obs1": "Poderá ser substituida pelas vacinas Tríplice Viral + Varicela Atenuada;",
  "Obs2": "Prevenção da varicela e suas complicações;",
  "Obs3": "Esquema básico: recomenda-se administrar 1 dose aos 4 anos de idade.;"
}

// FORMATO DO TEXTO NA CELULA QUANDO FOR ARRAY:
[
  "A vacina protege contra o Sarampo, Caxumba e Rubéola (Tríplice viral)",
  "A vacina não pode ser feita simuntaneamente com a vacina da febre amarela"
]
```


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

