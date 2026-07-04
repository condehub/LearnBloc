import { db } from './index'
import { trails, lessons, exercises, badges } from './schema'
import * as dotenv from 'dotenv'

dotenv.config()

// ─── Trail 1: Lógica de Programação e Desenvolvimento ────────────────────────

const trail1Lessons = [
  // ─── Lição 1: Lógica de Programação com TypeScript ──────────────────────────
  {
    order: 1,
    title: 'Lógica de Programação com TypeScript',
    xpReward: 100,
    references: [
      { title: 'TypeScript Handbook — Basic Types', url: 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html' },
      { title: 'TypeScript Handbook — Functions', url: 'https://www.typescriptlang.org/docs/handbook/2/functions.html' },
      { title: 'TypeScript Deep Dive — Types', url: 'https://basarat.gitbook.io/typescript/type-system' },
    ],
    theoryContent: `# Lógica de Programação com TypeScript

## O que é TypeScript?

TypeScript é um superset tipado de JavaScript desenvolvido pela Microsoft. Ele adiciona **tipos estáticos** ao JavaScript, tornando o código mais seguro, previsível e fácil de manter. Todo código TypeScript é compilado para JavaScript.

\`\`\`typescript
// JavaScript puro — sem segurança de tipos
function somar(a, b) {
  return a + b
}

// TypeScript — tipos explícitos
function somar(a: number, b: number): number {
  return a + b
}
\`\`\`

## Tipos Primitivos

TypeScript possui os seguintes tipos primitivos:

- \`string\` — texto
- \`number\` — números (inteiros e decimais)
- \`boolean\` — verdadeiro ou falso
- \`null\` e \`undefined\` — ausência de valor
- \`symbol\` — identificador único
- \`bigint\` — inteiros de precisão arbitrária

\`\`\`typescript
const nome: string = 'Maria'
const idade: number = 25
const ativo: boolean = true
const nada: null = null
const indefinido: undefined = undefined
\`\`\`

## Inferência de Tipos

TypeScript consegue **inferir** o tipo automaticamente quando você inicializa uma variável:

\`\`\`typescript
const nome = 'Maria'   // TypeScript infere: string
const idade = 25       // TypeScript infere: number
const ativo = true     // TypeScript infere: boolean
\`\`\`

## Arrays e Tuplas

\`\`\`typescript
// Arrays
const numeros: number[] = [1, 2, 3, 4, 5]
const nomes: Array<string> = ['Ana', 'Bob', 'Carlos']

// Tuplas — arrays com tamanho e tipos fixos
const pessoa: [string, number] = ['Maria', 25]
\`\`\`

## Interfaces e Type Aliases

Interfaces definem a forma de um objeto:

\`\`\`typescript
interface Usuario {
  id: number
  nome: string
  email: string
  ativo?: boolean // opcional
}

// Type alias — semelhante à interface
type Ponto = {
  x: number
  y: number
}

const usuario: Usuario = {
  id: 1,
  nome: 'João',
  email: 'joao@email.com',
}
\`\`\`

## Funções

\`\`\`typescript
// Função nomeada com tipos explícitos
function calcularArea(largura: number, altura: number): number {
  return largura * altura
}

// Arrow function
const dobrar = (n: number): number => n * 2

// Parâmetros opcionais e padrão
function saudar(nome: string, saudacao: string = 'Olá'): string {
  return \`\${saudacao}, \${nome}!\`
}
\`\`\`

## Union Types e Type Guards

\`\`\`typescript
// Union type — pode ser um ou outro
type IdOuString = number | string

function processarId(id: IdOuString): string {
  if (typeof id === 'number') {
    return \`ID numérico: \${id}\`
  }
  return \`ID string: \${id}\`
}
\`\`\`

## Generics

Generics permitem criar componentes reutilizáveis com qualquer tipo:

\`\`\`typescript
function primeiroItem<T>(array: T[]): T | undefined {
  return array[0]
}

const primeiro = primeiroItem([1, 2, 3])         // number
const primeiraNome = primeiroItem(['Ana', 'Bob']) // string
\`\`\`

## Enums

\`\`\`typescript
enum Status {
  Ativo = 'ATIVO',
  Inativo = 'INATIVO',
  Pendente = 'PENDENTE',
}

const meuStatus: Status = Status.Ativo
\`\`\`

## Boas Práticas

1. **Prefira \`interface\` para objetos** e \`type\` para unions/interseções
2. **Evite \`any\`** — use \`unknown\` quando o tipo for realmente desconhecido
3. **Use \`const\` por padrão**, \`let\` quando precisar reatribuir
4. **Ative o modo strict** no \`tsconfig.json\` para máxima segurança
5. **Nomeie tipos com PascalCase** e variáveis com camelCase`,
    exercises: [
      {
        order: 1,
        question: 'Qual é a principal vantagem do TypeScript em relação ao JavaScript puro?',
        options: [
          'TypeScript executa mais rápido que JavaScript',
          'TypeScript adiciona tipagem estática, tornando o código mais seguro e previsível',
          'TypeScript funciona apenas no Node.js',
          'TypeScript é uma linguagem completamente diferente de JavaScript',
        ],
        correctAnswer: 1,
        explanation: 'O TypeScript adiciona tipagem estática ao JavaScript, o que permite detectar erros em tempo de compilação, antes do código ser executado. Isso torna o código mais seguro, mais fácil de manter e com melhor suporte em IDEs.',
        xpReward: 10,
      },
      {
        order: 2,
        question: 'Como declarar corretamente uma variável do tipo string em TypeScript?',
        options: [
          'var nome = string "Maria"',
          'string nome = "Maria"',
          'const nome: string = "Maria"',
          'nome: string => "Maria"',
        ],
        correctAnswer: 2,
        explanation: 'Em TypeScript, a anotação de tipo vem após o nome da variável, separada por dois pontos: `const nome: string = "Maria"`. O TypeScript também consegue inferir o tipo sem anotação explícita.',
        xpReward: 10,
      },
      {
        order: 3,
        question: 'O que é inferência de tipos no TypeScript?',
        options: [
          'Quando você declara o tipo explicitamente com dois pontos',
          'Quando o TypeScript deduz automaticamente o tipo de uma variável com base no valor atribuído',
          'Quando um tipo herda de outro tipo',
          'Quando dois tipos diferentes são combinados',
        ],
        correctAnswer: 1,
        explanation: 'Inferência de tipos ocorre quando o TypeScript deduz automaticamente o tipo de uma variável pelo valor atribuído. Por exemplo, `const x = 42` — o TypeScript infere que x é do tipo number sem você precisar declarar explicitamente.',
        xpReward: 10,
      },
      {
        order: 4,
        question: 'Qual a diferença entre `interface` e `type` no TypeScript?',
        options: [
          'Não há diferença, são exatamente iguais',
          'interface só pode ser usada com classes, type com funções',
          'interface pode ser estendida/mesclada e é recomendada para objetos; type é mais flexível para unions e interseções',
          'type é mais rápido que interface em tempo de execução',
        ],
        correctAnswer: 2,
        explanation: 'Interfaces podem ser estendidas e têm declaration merging (fusão automática com outra interface de mesmo nome). São recomendadas para objetos. Type aliases são mais versáteis para unions, interseções e tipos primitivos. Na prática, ambas são muito similares para objetos.',
        xpReward: 10,
      },
      {
        order: 5,
        question: 'O que é um Union Type em TypeScript?',
        options: [
          'Um tipo que combina as propriedades de dois objetos',
          'Um tipo que pode ser um de vários tipos possíveis, usando o operador |',
          'Um tipo exclusivo para arrays',
          'Um tipo que remove propriedades opcionais',
        ],
        correctAnswer: 1,
        explanation: 'Um Union Type permite que uma variável ou parâmetro seja de mais de um tipo. Exemplo: `type IdOuString = number | string`. O operador | separa os tipos possíveis.',
        xpReward: 10,
      },
      {
        order: 6,
        question: 'Como declarar um array de números em TypeScript?',
        options: [
          'const nums: Array(number) = [1, 2, 3]',
          'const nums: number[] = [1, 2, 3]',
          'const nums: [number] = [1, 2, 3]',
          'const nums = new Array<number>',
        ],
        correctAnswer: 1,
        explanation: 'Existem duas formas equivalentes de declarar um array de números: `number[]` ou `Array<number>`. A mais comum e recomendada é `number[]` por sua clareza.',
        xpReward: 10,
      },
      {
        order: 7,
        question: 'O que são Generics no TypeScript?',
        options: [
          'Um tipo padrão para valores desconhecidos',
          'Componentes ou funções reutilizáveis que funcionam com qualquer tipo passado como parâmetro',
          'Um atalho para criar interfaces automaticamente',
          'Uma forma de desabilitar a verificação de tipos',
        ],
        correctAnswer: 1,
        explanation: 'Generics permitem criar funções, classes e interfaces reutilizáveis que funcionam com qualquer tipo. O tipo é passado como parâmetro usando `<T>`. Exemplo: `function primeiroItem<T>(arr: T[]): T`.',
        xpReward: 10,
      },
      {
        order: 8,
        question: 'Qual a diferença entre `null` e `undefined` em TypeScript?',
        options: [
          'São exatamente iguais e intercambiáveis',
          '`null` representa ausência intencional de valor; `undefined` representa variável declarada mas não inicializada',
          '`undefined` é para objetos e `null` é para primitivos',
          'TypeScript não suporta `null`',
        ],
        correctAnswer: 1,
        explanation: '`null` é atribuído intencionalmente para indicar "sem valor". `undefined` ocorre quando uma variável é declarada mas não inicializada, ou quando uma função não retorna nada. Com a opção `strictNullChecks` ativada, eles são tipos distintos.',
        xpReward: 10,
      },
      {
        order: 9,
        question: 'O que o símbolo `?` faz em uma propriedade de interface?',
        options: [
          'Torna a propriedade do tipo any',
          'Torna a propriedade opcional — ela pode estar presente ou ausente no objeto',
          'Cria um union type com undefined',
          'Faz a propriedade ser somente leitura',
        ],
        correctAnswer: 1,
        explanation: 'O `?` após o nome de uma propriedade a torna opcional. Exemplo: `interface User { nome: string; email?: string }`. Isso significa que `email` pode ou não estar presente no objeto.',
        xpReward: 10,
      },
      {
        order: 10,
        question: 'Qual é o tipo TypeScript recomendado quando o tipo de um valor é genuinamente desconhecido?',
        options: [
          '`any` — desabilita completamente a verificação de tipos',
          '`object` — representa qualquer objeto',
          '`unknown` — requer verificação antes do uso, mantendo segurança de tipos',
          '`void` — usado para funções sem retorno',
        ],
        correctAnswer: 2,
        explanation: '`unknown` é a alternativa segura ao `any`. Com `unknown`, você precisa verificar o tipo antes de usá-lo, mantendo a segurança de tipos. `any` deve ser evitado pois desabilita toda verificação. Use `unknown` quando o tipo for genuinamente desconhecido.',
        xpReward: 10,
      },
    ],
  },

  // ─── Lição 2: Autenticação e JWT ────────────────────────────────────────────
  {
    order: 2,
    title: 'Autenticação e JWT com TypeScript',
    xpReward: 100,
    references: [
      { title: 'JWT.io — Introduction', url: 'https://jwt.io/introduction' },
      { title: 'OWASP — Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
      { title: 'RFC 7519 — JSON Web Token', url: 'https://datatracker.ietf.org/doc/html/rfc7519' },
    ],
    theoryContent: `# Autenticação e JWT com TypeScript

## O que é Autenticação?

Autenticação é o processo de **verificar a identidade** de um usuário. É diferente de autorização (o que o usuário pode fazer). O fluxo mais comum em aplicações web modernas usa **JWT (JSON Web Tokens)**.

## O que é JWT?

JWT (JSON Web Token) é um padrão aberto (RFC 7519) para transmitir informações de forma segura entre partes como um objeto JSON assinado digitalmente.

### Estrutura de um JWT

Um JWT é composto por três partes separadas por pontos (.):

\`\`\`
xxxxx.yyyyy.zzzzz
Header.Payload.Signature
\`\`\`

**Header** — tipo do token e algoritmo:
\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`

**Payload** — as "claims" (informações):
\`\`\`json
{
  "sub": "1234567890",
  "name": "Maria",
  "iat": 1516239022,
  "exp": 1516242622
}
\`\`\`

**Signature** — garante que o token não foi alterado:
\`\`\`
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
\`\`\`

## Fluxo de Autenticação

\`\`\`
1. Usuário faz login (email + senha)
2. Servidor verifica credenciais
3. Servidor gera Access Token (curta duração: 15min)
4. Servidor gera Refresh Token (longa duração: 7 dias)
5. Cliente armazena os tokens com segurança
6. Cliente envia Access Token no header Authorization nas requisições
7. Quando Access Token expirar, usa Refresh Token para obter novo
\`\`\`

## Implementando JWT com TypeScript

\`\`\`typescript
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET!

// Gerar token
function gerarToken(userId: number): string {
  return jwt.sign(
    { sub: userId },
    JWT_SECRET,
    { expiresIn: '15m' }
  )
}

// Verificar token
function verificarToken(token: string): { sub: number } {
  return jwt.verify(token, JWT_SECRET) as { sub: number }
}

// Hash de senha
async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, 12)
}

// Verificar senha
async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash)
}
\`\`\`

## Access Token vs Refresh Token

| | Access Token | Refresh Token |
|---|---|---|
| Duração | Curta (15min) | Longa (7 dias) |
| Onde fica | Memória da app | HTTP-only cookie ou SecureStore |
| Propósito | Autenticar requisições | Renovar Access Token |
| Revogável | Não (expira) | Sim (banco de dados) |

## Segurança — Boas Práticas

1. **Nunca armazene JWT no localStorage** — vulnerável a XSS
2. **Use HTTPS** sempre em produção
3. **Implemente refresh token rotation** — cada uso gera um novo
4. **Valide o token em cada requisição** — nunca confie sem verificar
5. **Use chaves secretas fortes** — mínimo 256 bits
6. **Inclua apenas dados necessários no payload** — o JWT é decodificável
7. **Implemente logout real** — invalide o refresh token no banco`,
    exercises: [
      {
        order: 1,
        question: 'O que é JWT (JSON Web Token)?',
        options: [
          'Um banco de dados para armazenar senhas de usuários',
          'Um padrão para transmitir informações de forma segura entre partes como um objeto JSON assinado digitalmente',
          'Um protocolo de rede para comunicação segura',
          'Uma biblioteca JavaScript para criptografia',
        ],
        correctAnswer: 1,
        explanation: 'JWT é um padrão aberto (RFC 7519) que define uma forma compacta e autossuficiente de transmitir informações entre partes como objeto JSON. As informações podem ser verificadas porque o token é assinado digitalmente.',
        xpReward: 10,
      },
      {
        order: 2,
        question: 'Quais são as três partes de um JWT?',
        options: [
          'Username, Password, Token',
          'Header, Payload, Signature',
          'Algorithm, Secret, Expiration',
          'ID, Data, Hash',
        ],
        correctAnswer: 1,
        explanation: 'Um JWT é formado por: Header (tipo e algoritmo), Payload (as claims/dados) e Signature (assinatura digital). As três partes são codificadas em Base64URL e separadas por pontos.',
        xpReward: 10,
      },
      {
        order: 3,
        question: 'Por que é recomendado usar tokens de curta duração (Access Tokens)?',
        options: [
          'Porque é mais fácil de implementar',
          'Para reduzir o tamanho do banco de dados',
          'Para limitar o tempo em que um token comprometido pode ser usado, reduzindo o impacto de um vazamento',
          'Porque o servidor não consegue armazenar tokens por muito tempo',
        ],
        correctAnswer: 2,
        explanation: 'Access tokens de curta duração (ex: 15 minutos) limitam a janela de ataque caso um token seja comprometido. Se um atacante obtiver o token, ele só terá utilidade por poucos minutos. Para conveniência, o Refresh Token de longa duração renova o Access Token.',
        xpReward: 10,
      },
      {
        order: 4,
        question: 'Qual a função do bcrypt no processo de autenticação?',
        options: [
          'Gerar e verificar tokens JWT',
          'Criptografar a comunicação entre cliente e servidor',
          'Fazer hash seguro de senhas antes de armazená-las no banco de dados',
          'Validar o formato de email do usuário',
        ],
        correctAnswer: 2,
        explanation: 'bcrypt é um algoritmo de hashing de senhas que inclui um "salt" automático e é intencionalmente lento (configurável), tornando ataques de força bruta muito mais difíceis. Nunca armazene senhas em texto puro — sempre use bcrypt ou argon2.',
        xpReward: 10,
      },
      {
        order: 5,
        question: 'Por que não se deve armazenar JWT no localStorage do navegador?',
        options: [
          'Porque o localStorage tem limite de tamanho muito pequeno',
          'Porque o localStorage é vulnerável a ataques XSS — qualquer script malicioso pode ler os tokens',
          'Porque o localStorage não funciona em dispositivos móveis',
          'Porque os tokens no localStorage expiram automaticamente',
        ],
        correctAnswer: 1,
        explanation: 'O localStorage é acessível por qualquer JavaScript na página, tornando os tokens vulneráveis a ataques XSS (Cross-Site Scripting). A alternativa segura é usar HTTP-only cookies (não acessíveis por JS) ou, em apps móveis, Secure Storage como o Expo SecureStore.',
        xpReward: 10,
      },
      {
        order: 6,
        question: 'O que é "refresh token rotation"?',
        options: [
          'Gerar um novo JWT para cada requisição',
          'Alterar o secret JWT periodicamente',
          'A cada uso do refresh token, um novo refresh token é gerado e o antigo é invalidado',
          'Dividir o token em múltiplas partes',
        ],
        correctAnswer: 2,
        explanation: 'Refresh token rotation significa que cada vez que você usa um refresh token para obter um novo access token, o refresh token atual é invalidado e um novo é emitido. Isso detecta roubo de token: se o original for usado por um atacante, o usuário legítimo receberá um erro.',
        xpReward: 10,
      },
      {
        order: 7,
        question: 'Qual claim do JWT indica a data de expiração?',
        options: [
          '`sub` (subject)',
          '`iat` (issued at)',
          '`exp` (expiration time)',
          '`aud` (audience)',
        ],
        correctAnswer: 2,
        explanation: '`exp` é a claim padrão que indica quando o token expira, em formato Unix timestamp. Bibliotecas JWT validam automaticamente se o token expirou. `iat` é quando foi emitido, `sub` é o assunto (normalmente o ID do usuário).',
        xpReward: 10,
      },
      {
        order: 8,
        question: 'Como o Access Token deve ser enviado nas requisições HTTP?',
        options: [
          'No corpo (body) da requisição como campo `token`',
          'Na URL como query parameter: `?token=xxx`',
          'No header `Authorization` com o formato `Bearer <token>`',
          'Em um cookie de sessão',
        ],
        correctAnswer: 2,
        explanation: 'A forma padrão e mais segura é enviar o token no header HTTP: `Authorization: Bearer <token>`. Isso mantém o token fora da URL (que fica em logs) e do corpo da requisição.',
        xpReward: 10,
      },
      {
        order: 9,
        question: 'O que acontece com um JWT após ele ser emitido?',
        options: [
          'O servidor pode invalidá-lo a qualquer momento remotamente',
          'É imutável e válido até expirar — não pode ser invalidado pelo servidor sem uma blacklist',
          'Ele é automaticamente renovado a cada requisição',
          'O servidor atualiza o payload se os dados do usuário mudarem',
        ],
        correctAnswer: 1,
        explanation: 'JWTs são stateless — o servidor não mantém registro deles. Uma vez emitido, um JWT é válido até expirar, independentemente de o usuário fazer logout. Para invalidação imediata, você precisa manter uma blacklist de tokens ou usar sessions tradicionais. Por isso, use tokens de curta duração.',
        xpReward: 10,
      },
      {
        order: 10,
        question: 'Qual a diferença entre autenticação e autorização?',
        options: [
          'São sinônimos e significam a mesma coisa',
          'Autenticação verifica QUEM você é; autorização determina O QUE você pode fazer',
          'Autenticação é do lado do servidor; autorização é do lado do cliente',
          'Autorização vem antes da autenticação no fluxo',
        ],
        correctAnswer: 1,
        explanation: 'Autenticação responde "você é quem diz ser?" (login com email/senha + JWT). Autorização responde "você tem permissão para isso?" (admin pode deletar usuários, usuário comum não pode). Primeiro autentica, depois autoriza.',
        xpReward: 10,
      },
    ],
  },

  // ─── Lição 3: Drizzle ORM + PostgreSQL ──────────────────────────────────────
  {
    order: 3,
    title: 'Persistência de Dados com Drizzle ORM e PostgreSQL',
    xpReward: 100,
    references: [
      { title: 'Drizzle ORM — Getting Started', url: 'https://orm.drizzle.team/docs/overview' },
      { title: 'PostgreSQL — Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html' },
      { title: 'Drizzle ORM — Relations', url: 'https://orm.drizzle.team/docs/relations' },
    ],
    theoryContent: `# Persistência de Dados com Drizzle ORM e PostgreSQL

## O que é PostgreSQL?

PostgreSQL é um sistema de banco de dados relacional open-source, robusto e altamente escalável. É um dos bancos mais populares para aplicações web modernas.

### Conceitos Fundamentais

- **Tabela** — estrutura que armazena dados em linhas e colunas
- **Linha (Row)** — um registro individual
- **Coluna (Column)** — um atributo de cada registro
- **Chave Primária (Primary Key)** — identificador único de cada linha
- **Chave Estrangeira (Foreign Key)** — referência a outra tabela

## O que é Drizzle ORM?

Drizzle é um ORM (Object-Relational Mapping) moderno para TypeScript que:

- É **type-safe** — erros de query são detectados em compile time
- É **performático** — gera SQL eficiente
- Tem **migrations** simples com \`drizzle-kit\`
- Funciona com PostgreSQL, MySQL, SQLite

## Definindo o Schema

\`\`\`typescript
import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  autorId: integer('autor_id').notNull().references(() => usuarios.id),
  titulo: varchar('titulo', { length: 200 }).notNull(),
  conteudo: text('conteudo').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
\`\`\`

## Configurando a Conexão

\`\`\`typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })
\`\`\`

## Queries com Drizzle

\`\`\`typescript
import { db } from './db'
import { usuarios } from './schema'
import { eq, like } from 'drizzle-orm'

// SELECT * FROM usuarios
const todos = await db.select().from(usuarios)

// SELECT * FROM usuarios WHERE id = 1
const [usuario] = await db
  .select()
  .from(usuarios)
  .where(eq(usuarios.id, 1))

// INSERT
const [novoUsuario] = await db
  .insert(usuarios)
  .values({ nome: 'Maria', email: 'maria@email.com' })
  .returning()

// UPDATE
await db
  .update(usuarios)
  .set({ nome: 'Maria Silva' })
  .where(eq(usuarios.id, 1))

// DELETE
await db.delete(usuarios).where(eq(usuarios.id, 1))
\`\`\`

## Relations (Relações)

\`\`\`typescript
import { relations } from 'drizzle-orm'

export const usuariosRelations = relations(usuarios, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  autor: one(usuarios, {
    fields: [posts.autorId],
    references: [usuarios.id],
  }),
}))

// Query com join
const postsComAutor = await db.query.posts.findMany({
  with: { autor: true },
})
\`\`\`

## Migrations com Drizzle Kit

\`\`\`bash
# Gerar migration a partir do schema
npx drizzle-kit generate

# Aplicar migrations no banco
npx drizzle-kit push

# Interface visual para o banco
npx drizzle-kit studio
\`\`\`

## Tipos Importantes do PostgreSQL

| Tipo Drizzle | Tipo SQL | Uso |
|---|---|---|
| \`serial\` | SERIAL | ID auto-incremento |
| \`integer\` | INTEGER | Números inteiros |
| \`varchar(n)\` | VARCHAR(n) | Texto com limite |
| \`text\` | TEXT | Texto sem limite |
| \`boolean\` | BOOLEAN | Verdadeiro/Falso |
| \`timestamp\` | TIMESTAMP | Data e hora |
| \`jsonb\` | JSONB | JSON indexável |
| \`date\` | DATE | Apenas data |`,
    exercises: [
      {
        order: 1,
        question: 'O que é um ORM (Object-Relational Mapping)?',
        options: [
          'Um banco de dados relacional open-source',
          'Uma ferramenta que faz a ponte entre código orientado a objetos e banco de dados relacional, permitindo queries usando a linguagem do projeto',
          'Um protocolo de comunicação entre servidores',
          'Uma biblioteca para validação de dados',
        ],
        correctAnswer: 1,
        explanation: 'Um ORM mapeia tabelas do banco de dados para objetos/classes no código, permitindo fazer queries sem escrever SQL bruto. O Drizzle ORM é type-safe, detectando erros de query em compile time com TypeScript.',
        xpReward: 10,
      },
      {
        order: 2,
        question: 'Qual função do Drizzle é usada para definir uma tabela PostgreSQL?',
        options: [
          'createTable()',
          'defineTable()',
          'pgTable()',
          'makeTable()',
        ],
        correctAnswer: 2,
        explanation: '`pgTable()` do pacote `drizzle-orm/pg-core` é a função usada para definir tabelas PostgreSQL no schema do Drizzle. Para outros bancos, existem equivalentes como `mysqlTable()` e `sqliteTable()`.',
        xpReward: 10,
      },
      {
        order: 3,
        question: 'O que é uma chave estrangeira (Foreign Key)?',
        options: [
          'Um identificador único gerado automaticamente',
          'Uma coluna que referencia a chave primária de outra tabela, criando uma relação entre elas',
          'Um índice para acelerar buscas',
          'Uma senha criptografada no banco de dados',
        ],
        correctAnswer: 1,
        explanation: 'Uma Foreign Key é uma coluna que referencia a Primary Key de outra tabela, estabelecendo uma relação entre elas. No Drizzle: `autorId: integer("autor_id").references(() => usuarios.id)`. Isso garante integridade referencial.',
        xpReward: 10,
      },
      {
        order: 4,
        question: 'Qual a vantagem do tipo JSONB do PostgreSQL em relação a TEXT para armazenar JSON?',
        options: [
          'JSONB ocupa menos espaço que TEXT',
          'JSONB é indexável e permite queries dentro do JSON, diferente de TEXT que seria apenas uma string',
          'JSONB é mais rápido de inserir que TEXT',
          'JSONB valida automaticamente o schema do JSON',
        ],
        correctAnswer: 1,
        explanation: 'JSONB armazena dados JSON em formato binário, permite criar índices nas propriedades JSON e fazer queries dentro do documento. TEXT armazena como string e não permite queries no conteúdo sem conversão. JSONB é ideal para dados semi-estruturados.',
        xpReward: 10,
      },
      {
        order: 5,
        question: 'Como fazer um SELECT com WHERE no Drizzle ORM?',
        options: [
          'db.find(tabela, { id: 1 })',
          'db.select().from(tabela).where(eq(tabela.id, 1))',
          'db.query("SELECT * FROM tabela WHERE id = 1")',
          'tabela.findById(1)',
        ],
        correctAnswer: 1,
        explanation: 'No Drizzle, queries são construídas de forma fluente e type-safe: `db.select().from(tabela).where(eq(tabela.coluna, valor))`. A função `eq()` é importada de `drizzle-orm` e gera a condição `=` no SQL.',
        xpReward: 10,
      },
      {
        order: 6,
        question: 'O que faz `serial` no schema do Drizzle?',
        options: [
          'Define um campo de texto com comprimento serial',
          'Cria uma coluna com UUID aleatório',
          'Cria uma coluna inteira com auto-incremento automático, ideal para chaves primárias',
          'Define a ordem de inserção dos registros',
        ],
        correctAnswer: 2,
        explanation: '`serial` mapeia para o tipo SERIAL do PostgreSQL, que é uma coluna INTEGER com auto-incremento. Cada novo registro recebe automaticamente o próximo número da sequência. É a forma mais comum de definir chaves primárias numéricas.',
        xpReward: 10,
      },
      {
        order: 7,
        question: 'Qual o propósito do `drizzle-kit push`?',
        options: [
          'Publicar o código no servidor de produção',
          'Enviar dados do banco local para a nuvem',
          'Aplicar as alterações do schema TypeScript diretamente no banco de dados',
          'Instalar as dependências do Drizzle',
        ],
        correctAnswer: 2,
        explanation: '`drizzle-kit push` compara o schema TypeScript com o estado atual do banco e aplica as diferenças diretamente, sem gerar arquivos de migration. É útil em desenvolvimento. Para produção, é melhor usar `drizzle-kit generate` e aplicar migrations controladas.',
        xpReward: 10,
      },
      {
        order: 8,
        question: 'O que é o método `.returning()` em uma query Drizzle?',
        options: [
          'Cancela a operação e retorna ao estado anterior',
          'Faz a query retornar as linhas afetadas pela operação (INSERT, UPDATE, DELETE)',
          'Define quantas linhas devem ser retornadas',
          'Converte o resultado para JSON',
        ],
        correctAnswer: 1,
        explanation: '`.returning()` instrui o PostgreSQL a retornar as linhas após INSERT, UPDATE ou DELETE. Sem ele, essas operações não retornam dados. Exemplo: `await db.insert(users).values({...}).returning()` retorna o usuário criado com seu ID gerado.',
        xpReward: 10,
      },
      {
        order: 9,
        question: 'O que são "migrations" em banco de dados?',
        options: [
          'A transferência de dados entre bancos diferentes',
          'Scripts controlados e versionados que descrevem mudanças no schema do banco ao longo do tempo',
          'Backups automáticos do banco de dados',
          'A importação de dados de arquivos CSV',
        ],
        correctAnswer: 1,
        explanation: 'Migrations são scripts versionados que registram cada mudança no schema (criar tabelas, adicionar colunas, etc.). Permitem que toda a equipe e todos os ambientes tenham a mesma estrutura de banco. Podem ser revertidas (rollback) em caso de problemas.',
        xpReward: 10,
      },
      {
        order: 10,
        question: 'Qual a diferença entre `one` e `many` nas relations do Drizzle?',
        options: [
          '`one` retorna apenas a primeira linha; `many` retorna todas',
          '`one` define uma relação para um único registro relacionado (ex: post tem um autor); `many` define relação com múltiplos (ex: usuário tem muitos posts)',
          '`one` é para tabelas com pouco dados; `many` para tabelas grandes',
          '`one` usa LEFT JOIN; `many` usa INNER JOIN',
        ],
        correctAnswer: 1,
        explanation: 'Na função `relations()` do Drizzle, `one()` é usado para relações N:1 (muitos para um — o post pertence a UM autor) e `many()` para relações 1:N (um para muitos — o usuário tem MUITOS posts). Isso configura joins automáticos nas queries.',
        xpReward: 10,
      },
    ],
  },

  // ─── Lição 4: React + TypeScript ────────────────────────────────────────────
  {
    order: 4,
    title: 'Front-end com React e TypeScript',
    xpReward: 100,
    references: [
      { title: 'React Docs — Quick Start', url: 'https://react.dev/learn' },
      { title: 'React Docs — Hooks Reference', url: 'https://react.dev/reference/react' },
      { title: 'TypeScript + React Cheatsheet', url: 'https://react-typescript-cheatsheet.netlify.app/' },
    ],
    theoryContent: `# Front-end com React e TypeScript

## O que é React?

React é uma biblioteca JavaScript para construir interfaces de usuário, criada pelo Facebook. Ela usa uma abordagem baseada em **componentes** reutilizáveis e atualiza o DOM de forma eficiente através do **Virtual DOM**.

## Componentes

Em React, a UI é dividida em componentes independentes e reutilizáveis:

\`\`\`tsx
// Componente funcional com TypeScript
interface BotaoProps {
  texto: string
  onClick: () => void
  desabilitado?: boolean
}

function Botao({ texto, onClick, desabilitado = false }: BotaoProps) {
  return (
    <button onClick={onClick} disabled={desabilitado}>
      {texto}
    </button>
  )
}

// Usando o componente
<Botao texto="Clique aqui" onClick={() => console.log('clicou!')} />
\`\`\`

## JSX / TSX

JSX é uma extensão de sintaxe que permite escrever HTML dentro do JavaScript:

\`\`\`tsx
const elemento = (
  <div className="container">
    <h1>Título</h1>
    <p>Parágrafo com {2 + 2} como expressão</p>
  </div>
)
\`\`\`

## useState — Estado Local

\`\`\`tsx
import { useState } from 'react'

function Contador() {
  const [contagem, setContagem] = useState<number>(0)

  return (
    <div>
      <p>Contagem: {contagem}</p>
      <button onClick={() => setContagem(c => c + 1)}>Incrementar</button>
      <button onClick={() => setContagem(0)}>Resetar</button>
    </div>
  )
}
\`\`\`

## useEffect — Efeitos Colaterais

\`\`\`tsx
import { useState, useEffect } from 'react'

function PerfilUsuario({ userId }: { userId: number }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Executado após o componente montar ou quando userId mudar
    async function buscarUsuario() {
      const res = await fetch(\`/api/users/\${userId}\`)
      const data = await res.json()
      setUsuario(data)
      setCarregando(false)
    }

    buscarUsuario()
  }, [userId]) // dependências — re-executa quando mudar

  if (carregando) return <p>Carregando...</p>
  return <div>{usuario?.nome}</div>
}
\`\`\`

## Props e Children

\`\`\`tsx
interface CardProps {
  titulo: string
  children: React.ReactNode // qualquer conteúdo JSX
}

function Card({ titulo, children }: CardProps) {
  return (
    <div className="card">
      <h2>{titulo}</h2>
      <div className="card-body">{children}</div>
    </div>
  )
}

// Uso
<Card titulo="Meu Card">
  <p>Conteúdo do card</p>
</Card>
\`\`\`

## Custom Hooks

Hooks customizados extraem lógica reutilizável:

\`\`\`tsx
function useContador(inicial: number = 0) {
  const [valor, setValor] = useState(inicial)

  const incrementar = () => setValor(v => v + 1)
  const decrementar = () => setValor(v => v - 1)
  const resetar = () => setValor(inicial)

  return { valor, incrementar, decrementar, resetar }
}

// Usando em qualquer componente
function MeuComponente() {
  const { valor, incrementar } = useContador(10)
  return <button onClick={incrementar}>{valor}</button>
}
\`\`\`

## Styled-Components

\`\`\`tsx
import styled from 'styled-components'

const BotaoPrimario = styled.button\`
  background: #6366f1;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #4f46e5;
  }
\`

// Props no styled-component
const Caixa = styled.div<{ ativo: boolean }>\`
  border: 2px solid \${props => props.ativo ? '#6366f1' : '#e2e8f0'};
\`
\`\`\``,
    exercises: [
      {
        order: 1,
        question: 'O que é um componente React?',
        options: [
          'Um arquivo de configuração do projeto',
          'Uma função ou classe JavaScript que aceita props e retorna elementos JSX descrevendo uma parte da UI',
          'Uma query ao banco de dados',
          'Um endpoint da API',
        ],
        correctAnswer: 1,
        explanation: 'Um componente React é uma função (ou classe) que aceita propriedades (props) e retorna JSX — uma descrição de como uma parte da interface deve aparecer. Os componentes são reutilizáveis e podem ser compostos para criar interfaces complexas.',
        xpReward: 10,
      },
      {
        order: 2,
        question: 'Para que serve o hook `useState`?',
        options: [
          'Para fazer requisições HTTP',
          'Para gerenciar estado local dentro de um componente funcional, e re-renderizar quando ele muda',
          'Para acessar o contexto da aplicação',
          'Para criar estilos dinâmicos',
        ],
        correctAnswer: 1,
        explanation: '`useState` adiciona estado local a um componente funcional. Retorna um par: o valor atual do estado e uma função para atualizá-lo. Quando o estado muda, React re-renderiza o componente automaticamente.',
        xpReward: 10,
      },
      {
        order: 3,
        question: 'Qual é o segundo argumento do `useEffect` e para que serve?',
        options: [
          'Uma função de cleanup, executada quando o componente desmonta',
          'Um array de dependências — o efeito re-executa quando algum valor do array muda',
          'Um número que define o intervalo de execução em milissegundos',
          'Um booleano que ativa ou desativa o efeito',
        ],
        correctAnswer: 1,
        explanation: 'O segundo argumento do `useEffect` é o array de dependências. Se vazio `[]`, o efeito executa apenas na montagem. Se tiver valores `[userId]`, re-executa quando esses valores mudam. Se omitido, executa a cada render.',
        xpReward: 10,
      },
      {
        order: 4,
        question: 'O que são "props" em React?',
        options: [
          'Propriedades CSS dos elementos',
          'Dados passados de um componente pai para um componente filho, que não podem ser modificados pelo filho',
          'Variáveis de estado internas do componente',
          'Funções executadas ao montar o componente',
        ],
        correctAnswer: 1,
        explanation: 'Props (propriedades) são dados passados de componentes pais para filhos, como atributos HTML. São somente-leitura no componente filho — o filho não deve modificar suas props. Para dados mutáveis, use `useState`.',
        xpReward: 10,
      },
      {
        order: 5,
        question: 'O que é JSX?',
        options: [
          'Uma versão simplificada do JavaScript sem tipos',
          'Uma extensão de sintaxe do JavaScript que permite escrever elementos parecidos com HTML dentro do código JS',
          'Um formato de arquivo para configurações React',
          'Uma biblioteca de estilização',
        ],
        correctAnswer: 1,
        explanation: 'JSX é uma extensão de sintaxe que o Babel compila para chamadas `React.createElement()`. Permite escrever HTML dentro do JavaScript de forma mais legível. Com TypeScript, usamos `.tsx` para arquivos com JSX.',
        xpReward: 10,
      },
      {
        order: 6,
        question: 'O que é um Custom Hook?',
        options: [
          'Um hook exclusivo do React Native',
          'Uma função que começa com `use` e extrai lógica de estado reutilizável para ser compartilhada entre componentes',
          'Um tipo especial de componente sem interface visual',
          'Uma função para fazer requisições HTTP',
        ],
        correctAnswer: 1,
        explanation: 'Custom hooks são funções que começam com `use` e podem usar outros hooks. Permitem extrair e reutilizar lógica de estado entre componentes sem alterar a hierarquia de componentes. Exemplo: `useAuth()`, `useLocalStorage()`, `useFetch()`.',
        xpReward: 10,
      },
      {
        order: 7,
        question: 'Como o Styled-Components funciona?',
        options: [
          'Cria arquivos CSS separados automaticamente',
          'Usa template literals para criar componentes React com estilos CSS encapsulados, gerados em runtime',
          'Converte classes CSS em props TypeScript',
          'É um substituto completo do CSS',
        ],
        correctAnswer: 1,
        explanation: 'Styled-components usa template literals para criar componentes com estilos. Os estilos são encapsulados no componente (sem conflito de classes), suportam props para estilos dinâmicos e geram class names únicos automaticamente.',
        xpReward: 10,
      },
      {
        order: 8,
        question: 'O que é `React.ReactNode`?',
        options: [
          'O nó raiz da árvore DOM',
          'Um tipo TypeScript que representa qualquer conteúdo que pode ser renderizado pelo React (JSX, strings, números, arrays, null)',
          'Uma referência ao elemento DOM nativo',
          'O componente raiz da aplicação',
        ],
        correctAnswer: 1,
        explanation: '`React.ReactNode` é o tipo mais amplo para conteúdo renderizável: inclui JSX, strings, números, arrays de ReactNode, null, undefined e booleans. Use em `children` quando o componente aceita qualquer conteúdo.',
        xpReward: 10,
      },
      {
        order: 9,
        question: 'Quando devo usar `useEffect` para buscar dados?',
        options: [
          'Nunca — buscar dados dentro de useEffect causa bugs',
          'Apenas quando o componente desmonta',
          'Para buscar dados após o componente montar ou quando dependências específicas mudam, mas bibliotecas como React Query são preferíveis para data fetching',
          'Apenas em componentes de classe',
        ],
        correctAnswer: 2,
        explanation: '`useEffect` pode ser usado para data fetching, especialmente em casos simples. Porém, para casos reais em produção, React Query (TanStack Query) ou SWR são preferíveis pois gerenciam cache, loading states, error states e re-fetching automaticamente.',
        xpReward: 10,
      },
      {
        order: 10,
        question: 'O que significa a sintaxe `const { valor, incrementar } = useContador()` em React?',
        options: [
          'Importação de módulos externos',
          'Desestruturação — extrai propriedades de um objeto retornado pelo hook para variáveis com nomes específicos',
          'Criação de um novo estado compartilhado',
          'Declaração de múltiplos estados simultâneos',
        ],
        correctAnswer: 1,
        explanation: 'É desestruturação de objeto (destructuring). Custom hooks normalmente retornam objetos com múltiplos valores. A desestruturação `const { valor, incrementar } = useContador()` extrai apenas as propriedades que você precisa do objeto retornado.',
        xpReward: 10,
      },
    ],
  },

  // ─── Lição 5: Consumo de APIs ────────────────────────────────────────────────
  {
    order: 5,
    title: 'Consumo de APIs com React e TypeScript',
    xpReward: 100,
    references: [
      { title: 'TanStack Query — Getting Started', url: 'https://tanstack.com/query/latest/docs/react/overview' },
      { title: 'Axios Documentation', url: 'https://axios-http.com/docs/intro' },
      { title: 'MDN — Fetch API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API' },
    ],
    theoryContent: `# Consumo de APIs com React e TypeScript

## Por que consumir APIs?

Aplicações modernas são separadas em frontend (interface) e backend (API). O frontend consome os dados do backend via HTTP, normalmente usando JSON.

## Fetch API

A forma mais básica de fazer requisições HTTP no JavaScript/TypeScript:

\`\`\`typescript
// GET simples
const res = await fetch('https://api.exemplo.com/usuarios')
const data = await res.json()

// POST com corpo JSON
const res = await fetch('https://api.exemplo.com/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`,
  },
  body: JSON.stringify({ nome: 'Maria', email: 'maria@email.com' }),
})

if (!res.ok) {
  throw new Error(\`Erro: \${res.status}\`)
}

const novoUsuario = await res.json()
\`\`\`

## Axios

Axios é uma biblioteca popular que simplifica requisições HTTP:

\`\`\`typescript
import axios from 'axios'

// Configurar instância com base URL
const api = axios.create({
  baseURL: 'https://api.exemplo.com',
  timeout: 10000,
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})

// GET
const { data } = await api.get<Usuario[]>('/usuarios')

// POST
const { data: novoUsuario } = await api.post<Usuario>('/usuarios', {
  nome: 'Maria',
  email: 'maria@email.com',
})
\`\`\`

## TanStack Query (React Query)

React Query é a forma profissional de gerenciar estado de servidor em React:

\`\`\`tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Buscar dados (GET)
function ListaUsuarios() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => api.get('/usuarios').then(r => r.data),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  })

  if (isLoading) return <Spinner />
  if (isError) return <Erro mensagem={error.message} />

  return (
    <ul>
      {data.map(u => <li key={u.id}>{u.nome}</li>)}
    </ul>
  )
}

// Criar dados (POST/PUT/DELETE)
function FormularioUsuario() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (novoUsuario: NovoUsuario) =>
      api.post('/usuarios', novoUsuario).then(r => r.data),
    onSuccess: () => {
      // Invalida cache e re-busca a lista
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })

  return (
    <button onClick={() => mutation.mutate({ nome: 'Maria', email: 'maria@email.com' })}>
      {mutation.isPending ? 'Criando...' : 'Criar Usuário'}
    </button>
  )
}
\`\`\`

## Tratamento de Erros

\`\`\`typescript
interface ApiError {
  error: string
  message: string
  statusCode: number
}

async function buscarUsuario(id: number): Promise<Usuario> {
  try {
    const res = await fetch(\`/api/usuarios/\${id}\`)

    if (!res.ok) {
      const erro: ApiError = await res.json()
      throw new Error(erro.message)
    }

    return res.json()
  } catch (err) {
    if (err instanceof Error) {
      throw err // Re-lança erros conhecidos
    }
    throw new Error('Erro desconhecido ao buscar usuário')
  }
}
\`\`\`

## Loading States e Skeleton Screens

\`\`\`tsx
function PerfilUsuario() {
  const { data, isLoading } = useQuery({ ... })

  if (isLoading) {
    return (
      <div>
        <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }} />
        <div className="skeleton" style={{ width: 200, height: 24 }} />
      </div>
    )
  }

  return <div>{data.nome}</div>
}
\`\`\``,
    exercises: [
      {
        order: 1,
        question: 'Qual a diferença principal entre `fetch` nativo e Axios?',
        options: [
          'fetch é mais rápido; Axios usa WebSockets',
          'Axios automaticamente converte JSON, lança erros em status 4xx/5xx, e suporta interceptors; fetch requer tratamento manual',
          'fetch é para GET; Axios é para POST',
          'Axios só funciona no Node.js; fetch só no navegador',
        ],
        correctAnswer: 1,
        explanation: 'Axios oferece: conversão automática de JSON, lançamento de erros para status HTTP de erro (fetch retorna ok=false mas não lança), interceptors de request/response, cancelamento de requests, e configuração de instâncias. fetch é mais baixo nível e requer mais código boilerplate.',
        xpReward: 10,
      },
      {
        order: 2,
        question: 'O que é o `queryKey` no React Query (TanStack Query)?',
        options: [
          'A chave de autenticação da API',
          'Um identificador único para a query, usado para cache e invalidação — o React Query re-busca quando muda',
          'O nome do endpoint da API',
          'A chave primária retornada pelo banco de dados',
        ],
        correctAnswer: 1,
        explanation: '`queryKey` é o identificador único da query. O React Query usa para cachear o resultado, deduplicar requisições simultâneas e saber quando invalidar/re-buscar. Ex: `[\'usuarios\', userId]` — se userId mudar, a query é re-executada automaticamente.',
        xpReward: 10,
      },
      {
        order: 3,
        question: 'O que é um interceptor no Axios?',
        options: [
          'Um middleware que intercepta e pode transformar requests ou responses antes de serem processados',
          'Um componente que exibe mensagens de erro',
          'Uma função que cancela requisições pendentes',
          'Um validador de resposta da API',
        ],
        correctAnswer: 0,
        explanation: 'Interceptors são funções executadas antes de cada request ser enviado ou após cada response ser recebida. São ideais para adicionar tokens de auth automaticamente em todas as requisições, ou para tratar erros globalmente (ex: redirecionar ao login se receber 401).',
        xpReward: 10,
      },
      {
        order: 4,
        question: 'O que o `useMutation` do React Query faz de diferente do `useQuery`?',
        options: [
          'useMutation é para queries lentas; useQuery para queries rápidas',
          'useQuery é para buscar dados (GET); useMutation é para criar/atualizar/deletar dados (POST/PUT/DELETE)',
          'useMutation funciona offline; useQuery requer internet',
          'Não há diferença, são equivalentes',
        ],
        correctAnswer: 1,
        explanation: '`useQuery` é para operações de leitura (GET) — busca dados, gerencia cache e re-fetching automático. `useMutation` é para operações de escrita (POST/PUT/DELETE) — executada manualmente com `.mutate()`, tem callbacks `onSuccess`, `onError`, e não é cacheada.',
        xpReward: 10,
      },
      {
        order: 5,
        question: 'O que significa `res.ok` ao usar a Fetch API?',
        options: [
          'O servidor respondeu com status HTTP 200-299 (sucesso)',
          'A resposta foi recebida sem erros de rede',
          'O JSON foi parseado com sucesso',
          'A requisição foi cancelada com sucesso',
        ],
        correctAnswer: 0,
        explanation: '`res.ok` é `true` quando o status HTTP está entre 200 e 299. fetch não lança erros para status 4xx/5xx — você precisa checar `res.ok` manualmente. Se false, você deve tratar como erro antes de tentar parsear o JSON de sucesso.',
        xpReward: 10,
      },
      {
        order: 6,
        question: 'O que é `staleTime` no React Query?',
        options: [
          'O tempo máximo que uma requisição pode demorar antes de ser cancelada',
          'O tempo em que os dados são considerados frescos — durante esse período, o React Query não re-busca automaticamente',
          'O tempo para expirar o cache completamente',
          'O intervalo de polling automático',
        ],
        correctAnswer: 1,
        explanation: '`staleTime` define por quanto tempo os dados são considerados "frescos". Dentro desse período, o React Query não re-busca ao montar o componente ou focar a janela. Após esse tempo, os dados ficam "stale" e serão re-buscados na próxima oportunidade.',
        xpReward: 10,
      },
      {
        order: 7,
        question: 'Por que é importante tipar a resposta da API em TypeScript?',
        options: [
          'Para que o código execute mais rápido',
          'Não é necessário, TypeScript infere automaticamente respostas HTTP',
          'Para ter autocomplete, detectar erros em compile time se a API mudar, e garantir que o código acesse apenas propriedades existentes',
          'Para comprimir o JSON automaticamente',
        ],
        correctAnswer: 2,
        explanation: 'Tipar respostas da API (`api.get<Usuario[]>("/usuarios")`) garante que você acesse apenas propriedades que existem no tipo, tem autocomplete no IDE, e recebe erros de compilação se usar uma propriedade errada. Sem tipos, erros só aparecem em runtime.',
        xpReward: 10,
      },
      {
        order: 8,
        question: 'O que é `queryClient.invalidateQueries()` no React Query?',
        options: [
          'Remove permanentemente os dados do cache',
          'Marca as queries especificadas como desatualizadas, fazendo o React Query re-buscá-las',
          'Cancela as queries em progresso',
          'Reseta todos os estados de erro',
        ],
        correctAnswer: 1,
        explanation: '`invalidateQueries` marca queries como stale, fazendo o React Query re-buscar os dados na próxima oportunidade (normalmente imediatamente se o componente estiver montado). É ideal para atualizar a UI após uma mutation — cria um usuário, invalida a lista de usuários.',
        xpReward: 10,
      },
      {
        order: 9,
        question: 'O que são Skeleton Screens e por que são melhores que spinners genéricos?',
        options: [
          'São componentes de erro que mostram o esqueleto do problema',
          'Placeholders animados que imitam a estrutura do conteúdo que será carregado, reduzindo a percepção de lentidão',
          'Telas de carregamento que bloqueiam toda a interação do usuário',
          'Animações de loading importadas de bibliotecas externas',
        ],
        correctAnswer: 1,
        explanation: 'Skeleton screens mostram o layout do conteúdo enquanto carrega, reduzindo o salto visual quando o conteúdo aparece. Pesquisas mostram que usuários percebem skeleton screens como mais rápidos que spinners, pois visualizam a estrutura da página antecipadamente.',
        xpReward: 10,
      },
      {
        order: 10,
        question: 'Como tratar erros de autenticação (401) globalmente em Axios?',
        options: [
          'Verificar status em cada componente individualmente',
          'Usar um response interceptor que redireciona para login quando o status for 401',
          'Usar try/catch em todas as chamadas da API',
          'Configurar o servidor para nunca retornar 401',
        ],
        correctAnswer: 1,
        explanation: 'Um response interceptor no Axios centraliza o tratamento de erros: `api.interceptors.response.use(null, (error) => { if (error.response?.status === 401) { redirectToLogin() } return Promise.reject(error) })`. Evita duplicar tratamento em toda a aplicação.',
        xpReward: 10,
      },
    ],
  },

  // ─── Lição 6: Testes com Jest + RTL ─────────────────────────────────────────
  {
    order: 6,
    title: 'Testes com Jest e React Testing Library',
    xpReward: 100,
    references: [
      { title: 'Jest — Getting Started', url: 'https://jestjs.io/docs/getting-started' },
      { title: 'React Testing Library — Introduction', url: 'https://testing-library.com/docs/react-testing-library/intro' },
      { title: 'Testing Library — Queries', url: 'https://testing-library.com/docs/queries/about' },
    ],
    theoryContent: `# Testes com Jest e React Testing Library

## Por que testar?

Testes garantem que seu código funciona conforme esperado, previnem regressões (bugs que voltam após correção) e documentam o comportamento do sistema.

### Pirâmide de Testes

\`\`\`
         /\\
        /  \\    E2E (Selenium, Playwright)
       /────\\   — poucos, lentos, caros
      /      \\
     /────────\\  Integration Tests
    /          \\ — quantidade média
   /────────────\\ Unit Tests
  /              \\ — muitos, rápidos, baratos
\`\`\`

## Jest

Jest é o framework de testes mais popular para JavaScript/TypeScript:

\`\`\`typescript
// Teste unitário simples
describe('função somar', () => {
  it('deve somar dois números corretamente', () => {
    expect(somar(2, 3)).toBe(5)
  })

  it('deve funcionar com números negativos', () => {
    expect(somar(-1, 1)).toBe(0)
  })

  it('deve retornar 0 quando ambos são 0', () => {
    expect(somar(0, 0)).toBe(0)
  })
})
\`\`\`

## Matchers Principais do Jest

\`\`\`typescript
expect(valor).toBe(5)                    // igualdade estrita (===)
expect(objeto).toEqual({ id: 1 })        // igualdade profunda
expect(array).toHaveLength(3)            // tamanho de array
expect(string).toContain('texto')        // contém string
expect(valor).toBeTruthy()               // truthy
expect(valor).toBeFalsy()               // falsy
expect(valor).toBeNull()                 // null
expect(fn).toThrow('mensagem')           // lança erro
expect(fn).toHaveBeenCalledWith(arg)     // mock foi chamado com
\`\`\`

## Mocks no Jest

\`\`\`typescript
// Mock de função
const mockFn = jest.fn()
mockFn.mockReturnValue(42)
mockFn.mockResolvedValue({ id: 1, nome: 'Maria' }) // async

// Mock de módulo
jest.mock('../api', () => ({
  buscarUsuario: jest.fn().mockResolvedValue({ id: 1, nome: 'Maria' }),
}))

// Spy em método existente
const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
\`\`\`

## React Testing Library

RTL testa componentes como o usuário os vê, não os detalhes de implementação:

\`\`\`tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Botao } from './Botao'

describe('Botao', () => {
  it('deve exibir o texto correto', () => {
    render(<Botao texto="Clique aqui" onClick={() => {}} />)

    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
  })

  it('deve chamar onClick quando clicado', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Botao texto="Clique" onClick={handleClick} />)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
\`\`\`

## Queries do RTL — Prioridade

\`\`\`tsx
// Ordem de preferência (mais acessível → menos acessível):
screen.getByRole('button', { name: 'Enviar' })  // 1ª — melhor
screen.getByLabelText('Email')                   // 2ª — para inputs
screen.getByPlaceholderText('Digite aqui')       // 3ª
screen.getByText('Título')                       // 4ª
screen.getByTestId('meu-componente')             // última — evitar
\`\`\`

## Testando Componentes Assíncronos

\`\`\`tsx
import { render, screen, waitFor } from '@testing-library/react'

test('deve exibir usuário após carregar', async () => {
  // Mock da API
  jest.mock('../api', () => ({
    buscarUsuario: jest.fn().mockResolvedValue({ nome: 'Maria' }),
  }))

  render(<PerfilUsuario userId={1} />)

  // Espera o estado de loading
  expect(screen.getByText('Carregando...')).toBeInTheDocument()

  // Aguarda o conteúdo aparecer
  await waitFor(() => {
    expect(screen.getByText('Maria')).toBeInTheDocument()
  })
})
\`\`\`

## Boas Práticas de Testes

1. **Teste comportamento, não implementação** — não teste estado interno
2. **Use queries por role/label** — não por className ou testId
3. **AAA Pattern**: Arrange (preparar), Act (agir), Assert (verificar)
4. **Um assert por teste** — testes focados são mais fáceis de depurar
5. **Nomes descritivos**: "deve [comportamento] quando [contexto]"
6. **Evite setTimeout em testes** — use `waitFor` ou `findBy``,
    exercises: [
      {
        order: 1,
        question: 'Qual a diferença entre `toBe` e `toEqual` no Jest?',
        options: [
          'São equivalentes e podem ser usados indistintamente',
          '`toBe` usa igualdade estrita (===) para primitivos; `toEqual` faz comparação profunda de objetos e arrays',
          '`toEqual` é mais rápido que `toBe`',
          '`toBe` é para strings; `toEqual` é para números',
        ],
        correctAnswer: 1,
        explanation: '`toBe` usa `Object.is` (similar a ===) — falha para objetos diferentes com mesmo conteúdo. `toEqual` faz comparação recursiva do conteúdo — `expect({a: 1}).toEqual({a: 1})` passa. Para primitivos, ambos funcionam; para objetos/arrays, use `toEqual`.',
        xpReward: 10,
      },
      {
        order: 2,
        question: 'O que são "mocks" em testes?',
        options: [
          'Dados de produção usados nos testes',
          'Substituições de dependências reais por versões controladas que simulam o comportamento esperado',
          'Testes que verificam performance',
          'Snapshots visuais dos componentes',
        ],
        correctAnswer: 1,
        explanation: 'Mocks substituem dependências externas (APIs, banco de dados, temporizadores) por versões controladas. Permitem testar em isolamento, controlar retornos e verificar se funções foram chamadas corretamente, sem depender de serviços externos.',
        xpReward: 10,
      },
      {
        order: 3,
        question: 'Qual a principal filosofia da React Testing Library?',
        options: [
          'Testar a implementação interna dos componentes para garantir qualidade do código',
          'Testar os componentes como o usuário os usa — pela interface visível, não pela implementação',
          'Sempre usar snapshots para verificar a renderização',
          'Testar apenas os hooks, não os componentes visuais',
        ],
        correctAnswer: 1,
        explanation: 'RTL segue o princípio: "quanto mais seus testes se parecem com a forma que seu software é usado, mais confiança eles te dão." Evite testar estado interno, refs ou detalhes de implementação. Teste o que o usuário vê e faz.',
        xpReward: 10,
      },
      {
        order: 4,
        question: 'Por que `getByRole` é preferido sobre `getByTestId` no RTL?',
        options: [
          'getByRole é mais rápido de executar',
          'getByRole testa acessibilidade implicitamente — se a query funciona, o componente tem o role ARIA correto e é acessível a usuários de tecnologia assistiva',
          'getByTestId não funciona em todos os navegadores',
          'getByRole é mais fácil de escrever',
        ],
        correctAnswer: 1,
        explanation: 'Queries por role (button, heading, textbox, etc.) verificam que seu componente é acessível — tem semântica HTML correta ou atributos ARIA. `getByTestId` é um escape hatch: use apenas quando nenhuma query semântica funcionar.',
        xpReward: 10,
      },
      {
        order: 5,
        question: 'O que é o padrão AAA em testes?',
        options: [
          'Async, Await, Assert — para testes assíncronos',
          'Arrange (preparar), Act (agir), Assert (verificar) — estrutura clara de um teste',
          'API, Application, Assert — para testes de integração',
          'Authentication, Authorization, Assertion — para testes de segurança',
        ],
        correctAnswer: 1,
        explanation: 'O padrão AAA organiza testes em três seções: Arrange (configura o que precisa — mocks, renders, dados), Act (executa a ação testada — click, submit, chamada de função), Assert (verifica o resultado — expect). Torna testes legíveis e estruturados.',
        xpReward: 10,
      },
      {
        order: 6,
        question: 'Quando usar `waitFor` no React Testing Library?',
        options: [
          'Para todos os testes, como boa prática',
          'Para aguardar que operações assíncronas (chamadas à API, atualizações de estado, animações) terminem antes de fazer asserções',
          'Para testar componentes que usam setTimeout',
          'Para medir o tempo de renderização do componente',
        ],
        correctAnswer: 1,
        explanation: '`waitFor` espera até que a callback não lance erros, com retries automáticos. Use quando o resultado esperado depende de operações assíncronas. Alternativa: queries `findBy*` que já incluem o waitFor internamente (`await screen.findByText("Maria")`).',
        xpReward: 10,
      },
      {
        order: 7,
        question: 'O que é `jest.fn()`?',
        options: [
          'Uma função que executa testes automaticamente',
          'Uma função mock que registra suas chamadas e pode ter retornos configurados com `.mockReturnValue()` e similares',
          'Uma função que gera dados aleatórios para testes',
          'Uma função para criar spies em métodos de classe',
        ],
        correctAnswer: 1,
        explanation: '`jest.fn()` cria uma função mock que: registra quantas vezes foi chamada, quais argumentos recebeu, e pode ter comportamento configurado (`mockReturnValue`, `mockResolvedValue`, `mockImplementation`). Use para verificar callbacks e substituir dependências.',
        xpReward: 10,
      },
      {
        order: 8,
        question: 'Qual a diferença entre `getBy`, `queryBy` e `findBy` no RTL?',
        options: [
          'São equivalentes com sintaxes diferentes',
          '`getBy` lança erro se não encontrar; `queryBy` retorna null; `findBy` é assíncrono e espera o elemento aparecer',
          '`queryBy` é para múltiplos elementos; `getBy` para um único',
          '`findBy` é mais rápido que `getBy`',
        ],
        correctAnswer: 1,
        explanation: '`getBy*` lança erro se o elemento não existir (use quando o elemento deve estar lá). `queryBy*` retorna null se não encontrar (use para verificar ausência). `findBy*` é assíncrono e espera até o elemento aparecer ou timeout (use para conteúdo carregado de forma assíncrona).',
        xpReward: 10,
      },
      {
        order: 9,
        question: 'O que é um teste de integração em contraste com um teste unitário?',
        options: [
          'Teste de integração é mais rápido que unitário',
          'Teste unitário testa uma função/componente isolado; teste de integração testa como múltiplas partes funcionam juntas',
          'Teste de integração usa sempre um banco de dados real',
          'Não há diferença prática entre eles',
        ],
        correctAnswer: 1,
        explanation: 'Testes unitários isolam a menor unidade testável (função, componente) com todos os externos mockados. Testes de integração verificam como múltiplas unidades funcionam juntas — ex: componente + hook + chamada de API mockada. São mais lentos mas detectam problemas de integração.',
        xpReward: 10,
      },
      {
        order: 10,
        question: 'Por que evitar testar detalhes de implementação em componentes React?',
        options: [
          'Porque é mais difícil de escrever',
          'Porque testes ligados a implementação quebram ao fazer refatorações sem mudar o comportamento, gerando falsos negativos e dificultando melhorias',
          'Porque o React não permite acesso ao estado interno',
          'Porque testes de implementação são mais lentos',
        ],
        correctAnswer: 1,
        explanation: 'Testar estado interno, nomes de funções ou estrutura do componente faz testes quebrarem quando você refatora sem mudar funcionalidade. Testes devem ser "detectores de bugs" — só quebrando quando o comportamento visível muda. Isso dá confiança para refatorar.',
        xpReward: 10,
      },
    ],
  },
]

async function seed() {
  console.log('🌱 Iniciando seed...')

  // ─── Trail ─────────────────────────────────────────────────────────────────
  const [trail] = await db
    .insert(trails)
    .values({
      name: 'Lógica de Programação e Desenvolvimento',
      description: 'Aprenda a base de desenvolvimento de software com TypeScript, autenticação, banco de dados, React e testes — do zero ao profissional.',
      order: 1,
      isActive: true,
    })
    .returning()

  console.log(`✅ Trilha criada: ${trail.name} (ID: ${trail.id})`)

  // ─── Lessons & Exercises ───────────────────────────────────────────────────
  for (const lessonData of trail1Lessons) {
    const { exercises: exercisesData, ...lessonFields } = lessonData

    const [lesson] = await db
      .insert(lessons)
      .values({
        trailId: trail.id,
        title: lessonFields.title,
        theoryContent: lessonFields.theoryContent,
        references: lessonFields.references,
        order: lessonFields.order,
        xpReward: lessonFields.xpReward,
      })
      .returning()

    console.log(`  📚 Lição ${lesson.order}: ${lesson.title}`)

    for (const ex of exercisesData) {
      await db.insert(exercises).values({
        lessonId: lesson.id,
        question: ex.question,
        options: ex.options,
        correctAnswer: ex.correctAnswer,
        explanation: ex.explanation,
        order: ex.order,
        xpReward: ex.xpReward,
      })
    }

    console.log(`     ✓ ${exercisesData.length} exercícios criados`)
  }

  // ─── Badges ────────────────────────────────────────────────────────────────
  const badgeData = [
    // Lição badges
    { name: 'TypeScript Iniciante', description: 'Completou a lição de Lógica com TypeScript', icon: 'code', type: 'lesson', requirement: { lessonId: 1 } },
    { name: 'Guardião JWT', description: 'Completou a lição de Autenticação e JWT', icon: 'shield', type: 'lesson', requirement: { lessonId: 2 } },
    { name: 'Mestre do Banco', description: 'Completou a lição de Drizzle e PostgreSQL', icon: 'database', type: 'lesson', requirement: { lessonId: 3 } },
    { name: 'Dev Frontend', description: 'Completou a lição de React e TypeScript', icon: 'monitor', type: 'lesson', requirement: { lessonId: 4 } },
    { name: 'Consumidor de APIs', description: 'Completou a lição de Consumo de APIs', icon: 'globe', type: 'lesson', requirement: { lessonId: 5 } },
    { name: 'Testador Certificado', description: 'Completou a lição de Jest e RTL', icon: 'check-circle', type: 'lesson', requirement: { lessonId: 6 } },
    // Trail badge
    { name: 'Full Stack Developer', description: 'Completou toda a trilha de Lógica e Desenvolvimento', icon: 'award', type: 'trail', requirement: { trailId: 1 } },
    // Streak badges
    { name: '3 Dias Seguidos', description: 'Manteve uma ofensiva de 3 dias', icon: 'flame', type: 'streak', requirement: { days: 3 } },
    { name: 'Uma Semana Forte', description: 'Manteve uma ofensiva de 7 dias', icon: 'zap', type: 'streak', requirement: { days: 7 } },
    { name: 'Mês Dedicado', description: 'Manteve uma ofensiva de 30 dias', icon: 'star', type: 'streak', requirement: { days: 30 } },
    // Level badges
    { name: 'Level 5', description: 'Atingiu o nível 5', icon: 'trending-up', type: 'level', requirement: { level: 5 } },
    { name: 'Level 10', description: 'Atingiu o nível máximo', icon: 'crown', type: 'level', requirement: { level: 10 } },
  ]

  for (const badge of badgeData) {
    await db.insert(badges).values(badge)
  }

  console.log(`\n🏆 ${badgeData.length} badges criados`)
  console.log('\n✅ Seed concluído com sucesso!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err)
  process.exit(1)
})
