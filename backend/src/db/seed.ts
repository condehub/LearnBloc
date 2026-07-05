import { db } from './index'
import { trails, lessons, exercises, users, userProgress, exerciseSubmissions, badges } from './schema'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpando tabelas na ordem correta para não quebrar constraints
  console.log('🧹 Limpando dados antigos...')
  await db.delete(exerciseSubmissions)
  await db.delete(userProgress)
  await db.delete(exercises)
  await db.delete(lessons)
  await db.delete(trails)

  console.log('🗺️ Criando Trilhas...')
  const [trail1] = await db
    .insert(trails)
    .values({
      name: 'Fullstack Mastery',
      description: 'Aprenda tudo que precisa para ser um desenvolvedor Fullstack do zero ao avançado.',
      order: 1,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
    })
    .returning()

  console.log('📚 Criando Lições e Teorias...')
  
  const seedLessons = [
    {
      trailId: trail1.id,
      title: 'Lógica de Programação com TypeScript',
      theoryContent: `# Lógica de Programação com TypeScript
Nesta lição você aprenderá os fundamentos de programação utilizando TypeScript.
TypeScript é um superset do JavaScript que adiciona tipagem estática e outros recursos à linguagem.
- Variáveis e Tipos Básicos (string, number, boolean)
- Estruturas de controle (if, else, switch)
- Laços de repetição (for, while)
- Funções e tipagem de retorno`,
      order: 1,
      xpReward: 100,
      exercise: {
        question: 'Qual é a principal vantagem do TypeScript em relação ao JavaScript puro?',
        options: [
          'TypeScript executa mais rápido no navegador',
          'TypeScript adiciona tipagem estática, tornando o código mais seguro antes da execução',
          'TypeScript é uma linguagem completamente diferente de JavaScript',
          'TypeScript funciona apenas com React'
        ],
        correctAnswer: 1,
        explanation: 'O TypeScript adiciona tipagem estática, permitindo pegar erros durante o desenvolvimento (em tempo de compilação) ao invés de em tempo de execução.',
      }
    },
    {
      trailId: trail1.id,
      title: 'Autenticação e JWT com TypeScript',
      theoryContent: `# Autenticação e JWT
Autenticação é o processo de confirmar a identidade de um usuário.
JWT (JSON Web Token) é um padrão aberto (RFC 7519) que define um modo compacto e independente para transmitir informações de forma segura entre as partes como um objeto JSON.
- **Header:** O tipo do token (JWT) e o algoritmo de assinatura.
- **Payload:** Contém as declarações (claims).
- **Signature:** Usada para verificar se a mensagem não foi alterada.`,
      order: 2,
      xpReward: 100,
      exercise: {
        question: 'Quais são as três partes principais de um JWT?',
        options: [
          'Username, Password, Token',
          'ID, Sessão, Hash',
          'Header, Payload, Signature',
          'Algorithm, Secret, Expiration'
        ],
        correctAnswer: 2,
        explanation: 'Um JWT é composto por três partes: Header (tipo e algoritmo), Payload (dados/claims), e Signature (assinatura digital para validação).',
      }
    },
    {
      trailId: trail1.id,
      title: 'Persistência de Dados com Prisma e PostgreSQL',
      theoryContent: `# Persistência de Dados
Vamos explorar como armazenar dados no banco de dados PostgreSQL usando Prisma e Drizzle com TypeScript.
Bancos de dados relacionais organizam dados em tabelas, que podem ser conectadas por relacionamentos (chaves estrangeiras).
ORMs facilitam a interação com o banco, provendo tipagem e simplificando queries SQL.`,
      order: 3,
      xpReward: 100,
      exercise: {
        question: 'Qual é o papel de um ORM na persistência de dados?',
        options: [
          'Gerar a interface gráfica do banco de dados',
          'Traduzir o código TypeScript/JavaScript para consultas SQL no banco de dados de forma simplificada',
          'Armazenar senhas com criptografia',
          'Substituir completamente a necessidade de um banco de dados relacional'
        ],
        correctAnswer: 1,
        explanation: 'Um ORM (como Prisma ou Drizzle) traduz código orientado a objetos (ou tipado) em queries SQL, abstraindo a complexidade e garantindo tipagem forte.',
      }
    },
    {
      trailId: trail1.id,
      title: 'Front-end com React e TypeScript',
      theoryContent: `# Front-end moderno
Nesta lição focaremos no React. O React é uma biblioteca JavaScript para construir interfaces de usuário.
Com o uso de TypeScript, podemos tipar nossos componentes (Props e State), evitando erros comuns e melhorando a inteligência da IDE.
- Componentes e JSX
- Gerenciamento de Estado (useState, useEffect)
- Tipagem de Props`,
      order: 4,
      xpReward: 100,
      exercise: {
        question: 'Por que usar TypeScript junto com React?',
        options: [
          'Para forçar o uso de classes ao invés de hooks',
          'Para tipar as props e o estado dos componentes, prevenindo erros na passagem de dados',
          'Porque o React não funciona mais com JavaScript puro',
          'Para melhorar o tempo de renderização (performance) na tela'
        ],
        correctAnswer: 1,
        explanation: 'TypeScript no React permite tipar as Props e os hooks (como useState), ajudando a detectar erros de passagem de propriedades antes mesmo de executar o código.',
      }
    },
    {
      trailId: trail1.id,
      title: 'Consumo de APIs com React e TypeScript',
      theoryContent: `# Consumindo APIs
Para que o Frontend se comunique com o Backend, consumimos APIs (normalmente REST).
Podemos usar o 'fetch' nativo ou bibliotecas como Axios, em conjunto com ferramentas poderosas de gerenciamento de estado assíncrono, como React Query.
A tipagem no consumo de API é essencial para garantir que a resposta do backend seja interpretada corretamente pelo React.`,
      order: 5,
      xpReward: 100,
      exercise: {
        question: 'Qual a principal vantagem de usar o React Query ao consumir APIs?',
        options: [
          'Ele gera o backend automaticamente',
          'Ele cuida apenas do roteamento no frontend',
          'Ele gerencia o estado do servidor (cache, retries, loading, error) de forma automática',
          'Ele aumenta a segurança da API escondendo as rotas'
        ],
        correctAnswer: 2,
        explanation: 'React Query simplifica o gerenciamento de estados assíncronos que vêm de servidores (Server State), controlando automaticamente o cache, estados de carregamento (loading), refetch e erros.',
      }
    },
    {
      trailId: trail1.id,
      title: 'Testes com Jest e React Testing Library',
      theoryContent: `# Testes de Software
Aprenda a garantir a qualidade do seu software utilizando Jest (test runner e assertions) e React Testing Library (para renderização de componentes e simulação de interações do usuário).
Escrever testes previne regressões (bugs voltando ao código) e documenta como a aplicação deve se comportar.`,
      order: 6,
      xpReward: 100,
      exercise: {
        question: 'Qual o principal foco da React Testing Library?',
        options: [
          'Testar os detalhes de implementação (como nomes de funções internas e estado do componente)',
          'Testar os componentes focando na maneira como o usuário interage com eles (testes de comportamento)',
          'Realizar testes End-to-End simulando um navegador real completo',
          'Medir a velocidade de execução do JavaScript'
        ],
        correctAnswer: 1,
        explanation: 'A React Testing Library encoraja escrever testes focados no comportamento, testando como o usuário vê e interage com o DOM, em vez de testar os detalhes internos (implementação) do componente.',
      }
    }
  ]

  for (const item of seedLessons) {
    const [lesson] = await db.insert(lessons).values({
      trailId: item.trailId,
      title: item.title,
      theoryContent: item.theoryContent,
      order: item.order,
      xpReward: item.xpReward,
      references: []
    }).returning()

    console.log(`- Inserindo lição: ${lesson.title}`)

    await db.insert(exercises).values({
      lessonId: lesson.id,
      question: item.exercise.question,
      options: item.exercise.options,
      correctAnswer: item.exercise.correctAnswer,
      explanation: item.exercise.explanation,
      order: 1,
      xpReward: 10
    })
  }

  console.log('✅ Seed finalizado com sucesso!')
  process.exit(0)
}

main().catch((e) => {
  console.error('❌ Erro no seed:', e)
  process.exit(1)
})
