import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  PessoaCadastro,
  CampoPessoa,
  CamposPessoaTocados,
  ErrosPessoa,
  PessoaRascunho,
  pessoaEmBranco
} from './pessoa.model';

import { validarRascunhoPessoa } from './pessoa.validacao';
import { PessoaService } from '../services/pessoa.service';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pessoa.html',
  styleUrl: './pessoa.css'
})
export class Pessoa implements OnInit {
  modo: 'criar' | 'editar' = 'criar';
  id: number | null = null;
  loading = false;
  saving = false;
  formularioDisponivel = true;
  erro = '';

  readonly titulo = 'Formulário de Pessoa';

  rascunho: PessoaRascunho = pessoaEmBranco();

  tocados: CamposPessoaTocados = {};

  cadastrados: PessoaCadastro[] = [];

  constructor(
    private service: PessoaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modo = 'editar';
      this.id = Number(idParam);
      if (!Number.isInteger(this.id) || this.id <= 0) {
        this.erro = 'O cadastro informado é inválido.';
        this.formularioDisponivel = false;
        return;
      }
    }

    this.loading = true;
    this.service.listar().subscribe({
      next: (pessoas) => {
        this.cadastrados = pessoas;
        if (this.id === null) {
          this.loading = false;
          return;
        }
        this.service.buscarPorId(this.id).subscribe({
          next: (pessoa) => {
            const { id, ...dados } = pessoa;
            this.rascunho = dados;
            this.loading = false;
          },
          error: () => {
            this.erro = 'Não foi possível carregar a pessoa para edição.';
            this.formularioDisponivel = false;
            this.loading = false;
          }
        });
      },
      error: () => {
        this.erro = 'Não foi possível carregar as pessoas para validar o formulário.';
        if (this.id !== null) this.formularioDisponivel = false;
        this.loading = false;
      }
    });
  }

  get erros(): ErrosPessoa {
    return validarRascunhoPessoa(
      this.rascunho,
      this.cadastrados.filter((pessoa) => pessoa.id !== this.id)
    );
  }

  get quantidadeDeErros(): number {
    return Object.keys(this.erros).filter((c) => this.tocados[c as CampoPessoa]).length;
  }

  get temErro(): boolean {
    return Object.keys(this.erros).length > 0;
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

    this.saving = true;
    this.erro = '';
    const request = this.id === null
      ? this.service.criar(this.rascunho)
      : this.service.atualizar(this.id, this.rascunho);

    request.subscribe({
      next: () => this.router.navigate(['/pessoas']),
      error: () => {
        this.erro = 'Não foi possível salvar a pessoa.';
        this.saving = false;
      }
    });
  }

  limpar(): void {
    this.rascunho = pessoaEmBranco();
    this.tocados = {};
  }

  voltar(): void {
    this.router.navigate(['/pessoas']);
  }
}
