export interface PessoaCadastro {
  id: number;
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  nomePai: string;
  nomeMae: string;
  paisOrigem: string;
  ufOrigem: string;
  cidadeOrigem: string;
  email: string;
  telefone: string;
}

export type PessoaRascunho = Omit<PessoaCadastro, 'id'>;

export type CampoPessoa = keyof PessoaRascunho;

export type ErrosPessoa = Partial<Record<CampoPessoa, string>>;

export type CamposPessoaTocados = Partial<Record<CampoPessoa, boolean>>;

export function pessoaEmBranco(): PessoaRascunho {
  return {
    nomeCompleto: '',
    dataNascimento: '',
    cpf: '',
    rg: '',
    nomePai: '',
    nomeMae: '',
    paisOrigem: '',
    ufOrigem: '',
    cidadeOrigem: '',
    email: '',
    telefone: ''
  };
}