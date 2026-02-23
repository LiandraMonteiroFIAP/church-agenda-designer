

# Gerador de Agenda Semanal para Instagram Stories

Web app para criar imagens 9:16 da agenda semanal da igreja, pronta para postar no Instagram Stories.

## Estrutura da Interface

A tela será dividida em **duas colunas lado a lado**:

### Coluna Esquerda — Editor JSON
- Campo de texto (textarea) para editar o JSON com os eventos da semana
- O JSON terá a seguinte estrutura:
  - `backgroundImage`: URL ou base64 da imagem de fundo
  - `events`: array de eventos, cada um com:
    - `diaSemana`: sigla do dia (SEG, TER, QUA, etc.)
    - `titulo`: nome do evento (ex: "Sala de Oração")
    - `data`: data formatada (ex: "23 Fev")
    - `horario`: horário (ex: "20:30")
    - `local`: local do evento (ex: "Via Zoom")
    - `cor`: tipo de cor do badge — `"primaria"`, `"secundaria"` ou um hex code (ex: `"#4A7C59"`)
- Validação em tempo real do JSON com feedback visual de erros
- Botão **"Exportar PNG"** habilitado apenas quando o JSON é válido

### Coluna Direita — Preview
- Visualização ao vivo da imagem final em proporção 9:16
- Atualiza automaticamente ao editar o JSON
- Layout fiel à referência:
  - Imagem de fundo ocupando toda a área
  - Título fixo "Essa semana na Família Capão" com fontes Quicksand/Nunito Sans em branco
  - Versículo fixo ">> At 2.42" no topo
  - Card branco arredondado na parte inferior com a lista de eventos
  - Cada evento mostra: badge redondo com sigla do dia (na cor configurada), título em bold, e linha com data | horário | local
  - Eventos do mesmo dia são agrupados — o badge aparece apenas no primeiro
  - Logo e @handle fixos no rodapé
- Fontes: **Nunito Sans** para textos gerais e **Quicksand** para títulos/destaques

## Exportação
- Botão "Exportar PNG" gera uma imagem PNG em resolução **1080x1920** (padrão Instagram Story 9:16)
- Utiliza html-to-canvas (html2canvas) para capturar o preview como imagem
- Download automático do arquivo PNG

## Cores dos Badges
- **Primária**: tom azul escuro/steel (como na referência, ex: #4A6FA5)
- **Secundária**: tom dourado/olive (como na referência, ex: #8B7D3C)
- **Personalizada**: qualquer hex code definido no JSON

## Design
- Interface limpa e minimalista
- Responsiva mas otimizada para desktop (onde será mais utilizada)
- Sem necessidade de backend — tudo roda no navegador

