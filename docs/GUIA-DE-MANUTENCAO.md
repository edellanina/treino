# Treino — Guia de Manutenção

> App PWA de acompanhamento de 30 dias de calistenia para reabilitação de quadril + isometria.

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Arquitetura](#3-arquitetura)
4. [Modelo de Dados](#4-modelo-de-dados)
5. [Sistema de Design](#5-sistema-de-design)
6. [Como Rodar Localmente](#6-como-rodar-localmente)
7. [Como Fazer Deploy](#7-como-fazer-deploy)
8. [Como Alterar os Treinos](#8-como-alterar-os-treinos)
9. [Estrutura de Arquivos](#9-estrutura-de-arquivos)
10. [Fluxo do Usuário](#10-fluxo-do-usuário)
11. [Regras de Negócio](#11-regras-de-negócio)
12. [PWA — Configuração e Debug](#12-pwa--configuração-e-debug)
13. [Gotchas e Armadilhas Conhecidas](#13-gotchas-e-armadilhas-conhecidas)
14. [Checklist de Troubleshooting](#14-checklist-de-troubleshooting)

---

## 1. Visão Geral

**Treino** é um Progressive Web App que substitui uma planilha Excel de fisioterapia por uma interface mobile otimizada. O app guia o usuário por 30 dias de exercícios isométricos e de fortalecimento para o quadril, com registro diário de dor, esforço, sono e observações.

- **URL de produção:** `edellanina.github.io/treino`
- **Plataforma alvo:** iPhone (Safari) — instalável como app nativo via "Adicionar à Tela de Início"
- **Persistência:** 100% local (`localStorage` do navegador), zero dados em servidor
- **Offline:** funciona sem internet após primeira visita (service worker)

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão | Por quê |
|--------|-----------|--------|---------|
| Framework | React | 19.2 | Componentização, hooks, ecossistema |
| Bundler | Vite | 8.1 | Build rápido, HMR, integração PWA |
| Linguagem | TypeScript | 6.0 | Tipagem, segurança em refactors |
| CSS | Tailwind CSS | 4.3 | Utility-first, `@theme` nativo, sem config file |
| Roteamento | react-router-dom | 7.18 | SPA routing com `BrowserRouter` |
| Animações | Framer Motion | 12.42 | Transições suaves, gestos, layout animations |
| Ícones | Lucide React | 1.22 | Ícones consistentes, tree-shakeable |
| PWA | vite-plugin-pwa | 1.3 | Service worker, manifest, offline |
| Hospedagem | GitHub Pages | — | Grátis, HTTPS, deploy automático via Actions |

### Por que Tailwind CSS v4 (sem config files)

Tailwind v4 usa a diretiva `@theme` no CSS para definir tokens de design. **Não existe `tailwind.config.js` nem `postcss.config.js`**. Toda customização está em `src/index.css`.

---

## 3. Arquitetura

```
┌──────────────────────────────────────────────────────┐
│                    BrowserRouter                      │
│  ┌────────────────────────────────────────────────┐  │
│  │                  AppContent                     │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │         useLocalStorage('treino-records') │  │  │
│  │  │         ┌─────────────────────────────┐   │  │  │
│  │  │         │   localStorage (iPhone)     │   │  │  │
│  │  │         │   {                         │   │  │  │
│  │  │         │     _meta: "2026-06-29",    │   │  │  │
│  │  │         │     1: { status, pain... }, │   │  │  │
│  │  │         │     2: { ... },             │   │  │  │
│  │  │         │     ...                     │   │  │  │
│  │  │         │   }                         │   │  │  │
│  │  │         └─────────────────────────────┘   │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  │                                                │  │
│  │  Rotas:                                        │  │
│  │  /treino/          → HomePage                  │  │
│  │  /treino/hoje      → redireciona p/ dia atual  │  │
│  │  /treino/dia/:day  → WorkoutPage               │  │
│  │  /treino/guia      → GuidePage                 │  │
│  │  /treino/progresso → ProgressPage              │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │                BottomNav (fixo)                 │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Fluxo de dados

1. `AppContent` é o orquestrador central — detém o estado via `useLocalStorage`
2. Passa `records` e callbacks (`onSave`, `onSelectDay`) para as páginas via props
3. As páginas são puramente de apresentação, sem estado global (sem Redux, sem Context)
4. `WorkoutPageWithParams` é um wrapper interno que lê `useParams()` da URL e repassa para `WorkoutPage`

---

## 4. Modelo de Dados

### TypeScript (`src/types/index.ts`)

```typescript
type DayStatus = 'done' | 'partial' | 'missed' | 'pending';

interface DayRecord {
  status: DayStatus;
  pain_before: number;   // 0–10
  pain_after: number;    // 0–10
  effort: number;        // 1–5
  sleep: number;         // 0–10
  notes: string;
}

interface WorkoutDay {
  day: number;              // 1 a 30
  week: string;             // "S1" | "S2" | "S3" | "S4" | "Fim"
  focus: string;            // ex: "Isometria leve"
  exercises: string[];      // nomes dos exercícios
  volume: string;           // ex: "2 voltas"
  time_per_exercise?: string;  // ex: "5s cada"
  is_rest: boolean;         // dia de descanso completo
  is_active_recovery: boolean;  // dia de recuperação ativa
  description?: string;     // nota extra (ex: dia 29)
}
```

### localStorage (`treino-records`)

```json
{
  "_meta": "2026-06-29",
  "1": {
    "status": "done",
    "pain_before": 2,
    "pain_after": 1,
    "effort": 3,
    "sleep": 7,
    "notes": "Caminhei 25 min"
  },
  "2": {
    "status": "partial",
    "pain_before": 3,
    "pain_after": 2,
    "effort": 4,
    "sleep": 6,
    "notes": ""
  }
}
```

- `_meta` armazena a **data de início do plano** (string ISO `YYYY-MM-DD`). É gravada automaticamente na primeira visita.
- As chaves numéricas (`"1"`, `"2"`...) correspondem aos dias do plano.
- Dias sem registro simplesmente não existem no objeto.

### Cálculo do dia atual

```typescript
// App.tsx — getTodayPlanDay()
const diff = Math.floor((hoje - dataInicio) / msPorDia);
return Math.min(Math.max(diff + 1, 1), 30);
```

O dia 1 é o dia em que o usuário abriu o app pela primeira vez. Se `_meta` não existir (primeira visita), assume dia 1.

---

## 5. Sistema de Design

### Cores (Tailwind v4 `@theme`)

| Token | Hex | Uso |
|-------|-----|-----|
| `night-900` | `#08080f` | Fundo principal |
| `night-800` | `#131320` | Cards, superfícies |
| `night-700` | `#1a1a2e` | Superfície hover |
| `night-600` | `#1e293b` | Bordas |
| `night-500` | `#334155` | Scrollbar |
| `night-300` | `#64748b` | Texto secundário |
| `night-50` | `#e2e8f0` | Texto primário |
| `neon` | `#00d9ff` | Acento principal, CTA, dia atual |
| `emerald` | `#10b981` | Sucesso, concluído |
| `amber` | `#f59e0b` | Alerta moderado, parcial |
| `red` | `#ef4444` | Perigo, dor ≥5, não feito |

### Tipografia

| Token | Fonte | Uso |
|-------|-------|-----|
| `font-display` | Syne (500–800) | Títulos, cabeçalhos |
| `font-body` | DM Sans (400–700) | Corpo de texto, labels |
| `font-mono` | Space Mono (400, 700) | Números, badges, dados |

### Classes utilitárias customizadas

| Classe | Efeito |
|--------|--------|
| `glow-neon` | Sombra neon ciano (dia atual) |
| `glow-red` | Sombra vermelha (alerta crítico) |
| `glow-amber` | Sombra âmbar (alerta moderado) |
| `glow-emerald` | Sombra verde (sucesso) |
| `header-glow` | Gradiente + borda inferior para headers de página |
| `no-tap-highlight` | Remove highlight azul do iOS ao tocar |

Todas definidas em `src/index.css`.

---

## 6. Como Rodar Localmente

### Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

### Setup

```bash
# 1. Clonar
git clone git@github.com:edellanina/treino.git
cd treino

# 2. Instalar dependências
npm install

# 3. Rodar servidor de desenvolvimento
npm run dev
# Abre em http://localhost:5173/treino/

# 4. Build de produção
npm run build
# Gera a pasta dist/

# 5. Preview do build
npm run preview
```

### Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de dev com HMR |
| `npm run build` | TypeScript check + build Vite |
| `npm run preview` | Servir `dist/` localmente |
| `npm run lint` | Linter (oxlint) |

### Atenção ao base path

O `base` no `vite.config.ts` é `/treino/`. Isso afeta todas as URLs de assets. Ao rodar `npm run dev`, acesse `http://localhost:5173/treino/` (com a barra final). A raiz (`/`) não funciona.

---

## 7. Como Fazer Deploy

### Deploy automático (branch `main`)

1. Faça commit e push para `main`
2. GitHub Actions roda `.github/workflows/deploy.yml` automaticamente
3. Build → upload artifact → deploy no GitHub Pages
4. ~2 min depois, o site está atualizado em `edellanina.github.io/treino`

### Verificar status do deploy

1. Acesse `github.com/edellanina/treino/actions`
2. O workflow "Deploy para GitHub Pages" mostra o status
3. Verde = sucesso, Vermelho = falha

### Configuração necessária no GitHub

**No repositório, Settings → Pages:**
- Source: **GitHub Actions** (não "Deploy from a branch")

Se trocar para outro método, o deploy quebra.

### Checklist se o deploy falhar

1. Verificar se Pages está configurado como "GitHub Actions"
2. Verificar os logs da Action em `Actions → Deploy para GitHub Pages → build-and-deploy`
3. Causas comuns:
   - Erro de TypeScript → `npm run build` falha (confira `tsc -b`)
   - Dependências quebradas → `npm ci` falha
   - Token expirado → reconfigurar permissões de Actions

---

## 8. Como Alterar os Treinos

Os dados dos 30 dias estão em **três arquivos** dentro de `src/data/`. Para modificar exercícios, volumes ou instruções, edite diretamente esses arquivos:

### `src/data/workouts.ts` — Plano dos 30 dias

```typescript
{
  day: 1,                          // número do dia (1–30)
  week: 'S1',                      // S1, S2, S3, S4 ou Fim
  focus: 'Isometria leve',         // título do treino
  exercises: [                      // array de nomes
    'Glúteos deitado',
    'Adutores com travesseiro',
    // ...
  ],
  volume: '2 voltas',              // descrição do volume
  time_per_exercise: '5s cada',    // opcional — tempo por contração
  is_rest: false,                  // true = dia de descanso
  is_active_recovery: false,       // true = recuperação ativa
  description: undefined,          // opcional — nota extra
},
```

### `src/data/isometrics.ts` — Guia de execução

```typescript
{
  name: 'Glúteos deitado',        // deve bater com o nome em workouts.ts
  how_to: 'Deite de costas...',   // instrução passo a passo
  time_s1: '6 × 5s',             // tempo para Semana 1
  time_s2: '6-8 × 8s',           // tempo para Semana 2
  caution: 'Não fazer ponte...',  // cuidado/contraindicação
},
```

### `src/data/criteria.ts` — Critérios de segurança

```typescript
// Escala de dor
{
  situation: 'Dor durante o treino',
  signal: '0-2 / 10',
  decision: 'Pode manter',
  observation: 'Se aumentar, reduza intensidade.',
},
// Regras de progressão
{
  situation: 'Dia seguinte ao treino',
  signal: 'Sem piora',
  decision: 'Pode progredir',
  observation: 'Critério importante para iniciar Semana 3.',
},
```

### Regra de correspondência

O `WorkoutCard` cruza os exercícios de `workouts.ts` com as instruções de `isometrics.ts` por **nome exato** (`toLowerCase()`). Se você renomear um exercício, renomeie nos dois arquivos.

### Adicionar um novo exercício isométrico

1. Adicione a entrada em `src/data/isometrics.ts`
2. Referencie o nome em `src/data/workouts.ts` no dia desejado
3. A busca é automática via `WorkoutCard`

---

## 9. Estrutura de Arquivos

```
treino/
├── .github/workflows/
│   └── deploy.yml              # CI/CD — GitHub Actions
├── public/
│   ├── .nojekyll                # Impede build Jekyll no Pages
│   └── favicon.svg              # Ícone do app
├── src/
│   ├── main.tsx                 # Entry point React
│   ├── App.tsx                  # Rotas, estado global, orquestração
│   ├── index.css                # Tailwind v4 @theme + utilitários
│   ├── types/
│   │   └── index.ts             # Interfaces TypeScript
│   ├── data/
│   │   ├── workouts.ts          # 30 dias de treino
│   │   ├── isometrics.ts        # Guia de isometrias
│   │   └── criteria.ts          # Critérios de segurança
│   ├── hooks/
│   │   └── useLocalStorage.ts   # Hook genérico localStorage
│   ├── components/
│   │   ├── DayGrid.tsx          # Grade de 30 dias (5 semanas)
│   │   ├── DayCell.tsx          # Célula de 1 dia na grade
│   │   ├── WorkoutCard.tsx      # Card com exercícios expansíveis
│   │   ├── StatusSelector.tsx   # Seletor Feito/Parcial/Não feito
│   │   ├── PainSlider.tsx       # Slider de dor 0–10
│   │   ├── AlertBanner.tsx      # Banner de alerta (dor ≥3, ≥5)
│   │   ├── GuideTabs.tsx        # Abas Isometrias/Critérios/Progressão
│   │   ├── ProgressChart.tsx    # Gráficos e stats de progresso
│   │   └── BottomNav.tsx        # Barra de navegação inferior
│   └── pages/
│       ├── HomePage.tsx         # Home — grade + resumo + CTA
│       ├── WorkoutPage.tsx      # Treino do dia — exercícios + registro
│       ├── GuidePage.tsx        # Guia rápido
│       └── ProgressPage.tsx     # Progresso e estatísticas
├── index.html                   # Template HTML (Vite injeta scripts)
├── vite.config.ts               # Config Vite + PWA + base path
├── package.json                 # Dependências e scripts
├── tsconfig.json                # TypeScript config
└── docs/
    └── GUIA-DE-MANUTENCAO.md    # Este arquivo
```

---

## 10. Fluxo do Usuário

```
1. Usuário abre edellanina.github.io/treino no Safari

2. Primeira visita:
   └── _meta é gravado com a data de hoje
   └── Dia 1 é o "treino de hoje"

3. Home:
   ├── Vê grade dos 30 dias
   ├── Célula atual com glow neon
   ├── Dias passados: clicáveis (editar registro)
   ├── Dias futuros: bloqueados (opacidade 40%)

4. Toca "Treino de hoje" ou célula de dia passado:
   ├── WorkoutPage carrega com dados do dia
   ├── Exercícios expansíveis (toque para ver instruções)
   ├── Registro: status, dor antes/depois, esforço, sono, obs.
   └── Salva → volta pra Home → célula atualiza cor

5. Guia e Progresso acessíveis pela BottomNav
```

---

## 11. Regras de Negócio

| Regra | Onde está implementada |
|-------|----------------------|
| Dia futuro não pode ser acessado | `HomePage.handleSelectDay()` — `if (day <= currentDay)` |
| Dia atual com destaque neon | `DayCell.isCurrentDay` prop |
| Se dor ≥ 5: alerta vermelho para interromper | `AlertBanner` — renderiza se `maxPain >= 5` |
| Se dor 3–4: alerta âmbar para reduzir | `AlertBanner` — renderiza se `maxPain >= 3` |
| Dia de descanso: sem exercícios, só status | `WorkoutDay.is_rest` — `WorkoutCard` adapta UI |
| Recuperação ativa: só observações + status | `WorkoutDay.is_active_recovery` |
| Progressão entre semanas: baseada em dor dia seguinte | `criteria.ts` — exibido no Guia, não automatizado |

### Alerta de dor — lógica completa

```typescript
// AlertBanner.tsx
const maxPain = Math.max(painBefore, painAfter);

if (maxPain >= 5) → vermelho: "interrompa e consulte profissional"
if (maxPain >= 3) → âmbar: "reduza intensidade"
if (maxPain === 0) → não renderiza
```

O alerta aparece **em tempo real** conforme o usuário ajusta os sliders de dor.

---

## 12. PWA — Configuração e Debug

### Configuração atual (`vite.config.ts`)

```typescript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Treino — Calistenia 30 Dias',
    short_name: 'Treino',
    start_url: '/treino/',
    scope: '/treino/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#08080f',
    background_color: '#08080f',
  },
})
```

### Pontos críticos do PWA

1. **`start_url` e `scope`** precisam ser `/treino/` (não `/`). Se forem `/`, o app standalone abre `edellanina.github.io/` que dá 404.
2. **`display: 'standalone'`** faz o app abrir em tela cheia, sem barra de endereço.
3. **`registerType: 'autoUpdate'`** — o service worker atualiza automaticamente quando detecta nova versão.
4. **`includeAssets: ['favicon.svg']`** — garante que o ícone está no precache.

### Como debugar PWA no iPhone

1. **Para forçar update do service worker:**
   - Ajustes → Safari → Avançado → Website Data → procurar `edellanina.github.io` → remover
2. **Para ver o console do app standalone:**
   - Conecte o iPhone ao Mac via USB
   - Safari no Mac → Develop → [nome do iPhone] → [aba do app]
3. **Para testar offline:**
   - Modo Avião após carregar o app uma vez

### O que o service worker faz

- Precacheia HTML, JS, CSS e favicon (8 arquivos, ~423 KB)
- Permite uso offline após primeiro carregamento
- Atualiza automaticamente quando nova versão é detectada

---

## 13. Gotchas e Armadilhas Conhecidas

### 1. Tailwind v4 — sem config files

❌ **Não crie** `tailwind.config.js`, `tailwind.config.ts` ou `postcss.config.js`.
✅ Toda customização vai em `src/index.css` com `@theme { ... }`.

Se criar um config file, o Tailwind para de funcionar ou usa configurações conflitantes.

### 2. Base path `/treino/`

Todas as rotas, links e assets são prefixados com `/treino/`. Isso está em:
- `vite.config.ts` → `base: '/treino/'`
- `App.tsx` → todas as rotas começam com `/treino/`
- `index.html` → links e scripts

Se for mudar o nome do repositório, atualize **todos esses lugares**.

### 3. `_meta` no localStorage

O campo `_meta` é uma **string** (data ISO), não um objeto `DayRecord`. O TypeScript reclama porque `records` é tipado como `Record<number, DayRecord>`. O workaround é usar `as unknown as` nos casts. **Não mude a estrutura de `_meta`** sem atualizar `getTodayPlanDay()`.

### 4. WorkoutPageWithParams inline no App.tsx

A função `WorkoutPageWithParams` está definida **dentro de `App.tsx`**, não em arquivo separado. Motivo: ela precisa de `useParams()` que só funciona dentro de um `<Route>`. Se for extrair para outro arquivo, mantenha-a como componente filho da rota.

### 5. Correspondência de exercícios por nome

`WorkoutCard.tsx` busca instruções dos exercícios por `name.toLowerCase()`. Se um exercício em `workouts.ts` não tiver correspondência exata em `isometrics.ts`, o botão de expandir não aparece (sem erro, só fica estático).

### 6. Fontes do Google Fonts

As fontes (Syne, DM Sans, Space Mono) são carregadas via `<link>` no `index.html`. Em offline, as fontes podem não carregar — o app usa fallback do sistema (`sans-serif`, `monospace`).

### 7. Animações no iPhone

Framer Motion funciona bem no Safari iOS, mas animações complexas podem ter performance ruim em iPhones antigos. O app usa:
- `AnimatePresence` com `mode="wait"` para transições de rota
- Animações simples de opacity/y nas células da grade
- `whileTap` para feedback de toque
- Sem animações de layout complexas

---

## 14. Checklist de Troubleshooting

### "Tela em branco no Safari"

1. Verificar se o deploy foi concluído: `github.com/edellanina/treino/actions`
2. Verificar se Pages usa "GitHub Actions": `github.com/edellanina/treino/settings/pages`
3. Limpar cache: Ajustes → Safari → Limpar Histórico
4. Verificar console: conectar iPhone ao Mac, Safari → Develop

### "Erro 404 ao abrir pela Tela de Início"

1. Verificar `start_url` e `scope` no `vite.config.ts` — devem ser `/treino/`
2. Remover o app da Tela de Início e adicionar de novo
3. Limpar dados do site: Ajustes → Safari → Avançado → Website Data

### "Build falhou no CI"

1. Rodar `npm run build` localmente para ver o erro
2. Verificar se `tsc -b` passa (erros de tipo quebram o build)
3. Verificar se `npm ci` funciona (lock file sincronizado)

### "Dados sumiram"

1. Verificar se o usuário está em aba anônima (localStorage não persiste)
2. Verificar se o iOS está com pouco armazenamento (Safari pode limpar)
3. Os dados estão em `localStorage` chave `treino-records` — podem ser inspecionados no Safari DevTools

---

## Apêndice: Comandos úteis

```bash
# Rodar dev
npm run dev

# Build + type check
npm run build

# Ver apenas erros de tipo (sem build)
npx tsc --noEmit

# Servir build localmente
npm run preview

# Deploy manual (se CI falhar)
npm run build
git add dist -f
git commit -m "deploy manual"
git subtree push --prefix dist origin gh-pages
```

---

> **Última atualização:** 29 Jun 2026
> **Mantenedor:** @edellanina
