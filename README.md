# Calculadora Financeira

Uma calculadora financeira para projeções de patrimônio e retiradas em múltiplas moedas, com suporte para:
- Planejamento de investimentos a longo prazo
- Cálculo de retiradas fixas ou baseadas em percentual de lucros
- Visualização de dados em múltiplas moedas (Reais, Dólares e Euros)
- Gráficos detalhados para análise de patrimônio e retiradas
- Projeções personalizadas com taxas de juros e períodos ajustáveis

## Características

- Interface amigável e intuitiva
- Gráficos interativos para análise de dados
- Suporte a múltiplas moedas (BRL, USD, EUR)
- Possibilidade de salvar e carregar cálculos
- Funciona tanto como aplicação web quanto como aplicativo desktop standalone
- Compatível com Windows, macOS e Linux

## Como usar

### Web (Navegador)

Para usar a calculadora no navegador:

1. Abra o arquivo `index.html` em qualquer navegador moderno.
2. Insira os valores desejados nos campos de entrada.
3. Clique em "Calcular Projeção" para visualizar os resultados.
4. Use os botões "Salvar Cálculo" e "Carregar Cálculo" para gerenciar seus cálculos.

### Aplicativo Desktop (Windows, macOS, Linux)

#### Instalação a partir de binários pré-compilados

1. Acesse a página de [Releases](https://github.com/seunome/calculadora-financeira/releases) do projeto
2. Baixe a versão correspondente ao seu sistema operacional:
   - Windows: `.exe` ou `.msi`
   - macOS: `.dmg`
   - Linux: `.AppImage`, `.deb` ou `.rpm`
3. Execute o instalador ou arquivo baixado
4. Abra o aplicativo "Calculadora Financeira" a partir do menu iniciar, dock ou launcher

## Desenvolvimento

### Pré-requisitos

- [Node.js](https://nodejs.org/) 14.x ou superior
- [npm](https://www.npmjs.com/) 6.x ou superior

### Configurando o ambiente

1. Clone o repositório:
   ```
   git clone https://github.com/seunome/calculadora-financeira.git
   cd calculadora-financeira
   ```

2. Instale as dependências:
   ```
   npm install
   ```

### Executando em modo de desenvolvimento

```
npm start
```

### Preparando os ícones

Para criar os ícones da aplicação para diferentes plataformas, você precisará instalar:

- [ImageMagick](https://imagemagick.org/script/download.php) para conversão de SVG para PNG e criação de arquivos ICO
  - Ubuntu/Debian: `sudo apt-get install imagemagick`
  - macOS: `brew install imagemagick`
  - Windows: baixe e instale do site oficial

- libicns-utils para criar arquivos ICNS (formato macOS)
  - Ubuntu/Debian: `sudo apt-get install icnsutils`
  - macOS: `brew install libicns`

Depois execute o script:
```
node convert-icons.js
```

### Empacotando para distribuição

Para todas as plataformas:
```
npm run dist
```

Para uma plataforma específica:
```
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

Os arquivos compilados serão gerados na pasta `dist/`.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Suporte

Se tiver alguma dúvida ou sugestão, abra uma issue no [repositório do GitHub](https://github.com/seunome/calculadora-financeira/issues). 