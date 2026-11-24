export interface EmpresaCadastro {
  id: number;
  nome: string;
  cnpj: string;
  logomarca: string;
  fundacao: string;
  descricao: string;
}

export type EmpresaRascunho = Omit<EmpresaCadastro, 'id'>;
