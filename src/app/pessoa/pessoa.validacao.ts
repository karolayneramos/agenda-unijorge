import {
  ErrosPessoa,
  PessoaCadastro,
  PessoaRascunho
} from './pessoa.model';

export function obrigatorio(
  valor: string,
  campo: string
): string | null {
  return valor.trim().length === 0
    ? `${campo} não pode ficar em branco.`
    : null;
}

export function tamanhoEntre(
  valor: string,
  min: number,
  max: number,
  campo: string
): string | null {
  const texto = valor.trim();

  if (texto.length === 0) {
    return null;
  }

  if (texto.length < min || texto.length > max) {
    return `${campo} deve ter entre ${min} e ${max} caracteres.`;
  }

  return null;
}

export function quantidadeDeDigitos(
  valor: string,
  quantidade: number,
  campo: string
): string | null {
  const digitos = valor.replace(/\D/g, '');

  if (digitos.length === 0) {
    return null;
  }

  return digitos.length === quantidade
    ? null
    : `${campo} deve ter ${quantidade} dígitos.`;
}

export function validarNome(
  nome: string,
  campo: string
): string | null {
  const obrigatorioErro = obrigatorio(nome, campo);

  if (obrigatorioErro !== null) {
    return obrigatorioErro;
  }

  const tamanhoErro = tamanhoEntre(nome, 3, 100, campo);

  if (tamanhoErro !== null) {
    return tamanhoErro;
  }

  if (/\d/.test(nome)) {
    return `${campo} não pode conter números.`;
  }

  return null;
}

export function validarDataNascimento(
  data: string
): string | null {
  const erroObrigatorio = obrigatorio(
    data,
    'A data de nascimento'
  );

  if (erroObrigatorio !== null) {
    return erroObrigatorio;
  }

  const nascimento = new Date(`${data}T00:00:00`);

  if (Number.isNaN(nascimento.getTime())) {
    return 'Data de nascimento inválida.';
  }

  const hoje = new Date();

  if (nascimento > hoje) {
    return 'A data de nascimento não pode estar no futuro.';
  }

  return null;
}

export function validarCpf(cpf: string): string | null {
  const erroObrigatorio = obrigatorio(cpf, 'O CPF');

  if (erroObrigatorio !== null) {
    return erroObrigatorio;
  }

  return quantidadeDeDigitos(cpf, 11, 'O CPF');
}

export function validarRg(rg: string): string | null {
  const erroObrigatorio = obrigatorio(rg, 'O RG');

  if (erroObrigatorio !== null) {
    return erroObrigatorio;
  }

  return tamanhoEntre(rg, 5, 20, 'O RG');
}

export function validarEmail(email: string): string | null {
  const erroObrigatorio = obrigatorio(email, 'O e-mail');

  if (erroObrigatorio !== null) {
    return erroObrigatorio;
  }

  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!formato.test(email.trim())) {
    return 'E-mail em formato inválido.';
  }

  return null;
}

export function validarTelefone(telefone: string): string | null {
  const erroObrigatorio = obrigatorio(
    telefone,
    'O telefone'
  );

  if (erroObrigatorio !== null) {
    return erroObrigatorio;
  }

  return quantidadeDeDigitos(
    telefone,
    11,
    'O telefone'
  );
}

export function validarRascunhoPessoa(
  rascunho: PessoaRascunho,
  jaCadastrados: PessoaCadastro[]
): ErrosPessoa {
  const erros: ErrosPessoa = {};

  const defina = (
    campo: keyof ErrosPessoa,
    mensagem: string | null
  ): void => {
    if (mensagem !== null) {
      erros[campo] = mensagem;
    }
  };

  defina(
    'nomeCompleto',
    validarNome(rascunho.nomeCompleto, 'O nome completo')
  );

  defina(
    'dataNascimento',
    validarDataNascimento(rascunho.dataNascimento)
  );

  defina(
    'cpf',
    validarCpf(rascunho.cpf)
  );

  defina(
    'rg',
    validarRg(rascunho.rg)
  );

  defina(
    'nomePai',
    validarNome(rascunho.nomePai, 'O nome do pai')
  );

  defina(
    'nomeMae',
    validarNome(rascunho.nomeMae, 'O nome da mãe')
  );

  defina(
    'paisOrigem',
    obrigatorio(rascunho.paisOrigem, 'O país de origem')
  );

  defina(
    'ufOrigem',
    obrigatorio(rascunho.ufOrigem, 'A UF de origem')
  );

  defina(
    'cidadeOrigem',
    obrigatorio(rascunho.cidadeOrigem, 'A cidade de origem')
  );

  defina(
    'email',
    validarEmail(rascunho.email)
  );

  defina(
    'telefone',
    validarTelefone(rascunho.telefone)
  );

  const cpfExiste = jaCadastrados.some(
    pessoa =>
      pessoa.cpf.replace(/\D/g, '') ===
      rascunho.cpf.replace(/\D/g, '')
  );

  if (
    rascunho.cpf.trim().length > 0 &&
    cpfExiste
  ) {
    erros.cpf = 'Já existe um cadastro com este CPF.';
  }

  return erros;
}