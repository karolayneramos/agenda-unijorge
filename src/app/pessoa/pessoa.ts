import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  PessoaCadastro,
  CampoPessoa,
  CamposPessoaTocados,
  ErrosPessoa,
  PessoaRascunho,
  pessoaEmBranco
} from './pessoa.model';

import { validarRascunhoPessoa } from './pessoa.validacao';

@Component({
  selector: 'app-pessoa',
  imports: [FormsModule],
  templateUrl: './pessoa.html',
  styleUrl: './pessoa.css'
})
export class Pessoa {

  readonly titulo = 'Formulário de Pessoa';

  rascunho: PessoaRascunho = pessoaEmBranco();

  tocados: CamposPessoaTocados = {};

  cadastrados: PessoaCadastro[] = [];

  get erros(): ErrosPessoa {
    return validarRascunhoPessoa(
      this.rascunho,
      this.cadastrados
    );
  }

  get quantidadeDeErros(): number {
    return Object.keys(this.erros).length;
  }

  get temErro(): boolean {
    return this.quantidadeDeErros > 0;
  }

  deveMostrar(campo: CampoPessoa): boolean {
    return (
      this.tocados[campo] === true &&
      this.erros[campo] !== undefined
    );
  }

  mensagem(campo: CampoPessoa): string {
    return this.erros[campo] ?? '';
  }

  marcarTocado(campo: CampoPessoa): void {
    this.tocados[campo] = true;
  }

  mostrarTudo(): void {
    const campos = Object.keys(
      this.rascunho
    ) as CampoPessoa[];

    for (const campo of campos) {
      this.tocados[campo] = true;
    }
  }

  salvar(): void {
    if (this.temErro) {
      this.mostrarTudo();
      return;
    }

    this.cadastrados = [
      ...this.cadastrados,
      {
        id: this.proximoId(),
        ...this.rascunho
      }
    ];

    this.limpar();
  }

  limpar(): void {
    this.rascunho = pessoaEmBranco();
    this.tocados = {};
  }

  remover(id: number): void {
    this.cadastrados =
      this.cadastrados.filter(
        pessoa => pessoa.id !== id
      );
  }

  private proximoId(): number {
    const maior = this.cadastrados.reduce(
      (max, pessoa) =>
        Math.max(max, pessoa.id),
      0
    );

    return maior + 1;
  }
}
