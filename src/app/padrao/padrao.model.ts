/**
 * MODELO DE REFERENCIA
 *
 * Aqui mora o FORMATO dos dados. Nada de regra, nada de tela.
 * Repare em tres decisoes que se repetem em todo formulario:
 *
 *  1. As unioes de texto ('aluno' | 'professor' | ...) incluem ''
 *     porque o <select> comeca vazio.
 *  2. As datas sao string, nao Date: um <input type="date"> devolve
 *     texto no formato 'aaaa-mm-dd'.
 *  3. O que existe so na tela (confirmarSenha) NAO entra no modelo.
 */

export type Vinculo = 'aluno' | 'professor' | 'convidado' | '';

export type Genero = 'feminino' | 'masculino' | 'outro' | 'nao_informado' | '';

export type Curso =
  | 'Engenharia de Computacao'
  | 'Sistemas de Informacao'
  | 'Ciencia da Computacao'
  | '';

export const CURSOS: Curso[] = [
  'Engenharia de Computacao',
  'Sistemas de Informacao',
  'Ciencia da Computacao'
];

/** Dados públicos do cadastro; a senha nunca é persistida. */
export interface Cadastro {
  id: number;
  nome: string;
  dataNascimento: string;
  genero: Genero;
  email: string;
  telefone: string;
  cep: string;
  vinculo: Vinculo;
  curso: Curso;
  matricula: string;
  semestre: number | null;
  receberEmails: boolean;
  observacoes: string;
}

/**
 * O que existe ENQUANTO SE DIGITA.
 * A senha e sua confirmação são usadas somente durante o preenchimento.
 */
export type Rascunho = Omit<Cadastro, 'id'> & { senha: string; confirmarSenha: string };

/**
 * Os nomes dos campos, derivados do tipo acima.
 * Ninguem escreveu essa lista a mao: acrescente um campo no Rascunho
 * e ela se atualiza sozinha.
 */
export type CampoDoFormulario = keyof Rascunho;

/**
 * O mapa de erros: de cada campo para a sua mensagem.
 * Partial porque formulario valido e um objeto vazio: {}.
 */
export type ErrosCadastro = Partial<Record<CampoDoFormulario, string>>;

/** Idem para marcar em quais campos a pessoa ja entrou e saiu. */
export type CamposTocados = Partial<Record<CampoDoFormulario, boolean>>;

/** Uma ficha zerada. Funcao, e nao constante, para cada chamada devolver um objeto novo. */
export function rascunhoEmBranco(): Rascunho {
  return {
    nome: '',
    dataNascimento: '',
    genero: '',
    email: '',
    telefone: '',
    cep: '',
    vinculo: '',
    curso: '',
    matricula: '',
    semestre: null,
    confirmarSenha: '',
    senha: '',
    receberEmails: false,
    observacoes: ''
  };
}
