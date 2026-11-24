export interface Participante {
  id: number;
  descricao: string;
  email: string;
  telefone: string;
  formaPagamento: string;
  eventoId: number;
}

export const FORMAS_PAGAMENTO = ['PIX', 'Cartão', 'Boleto', 'Dinheiro'];