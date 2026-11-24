import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Cadastro,
  CampoDoFormulario,
  CamposTocados,
  CURSOS,
  Curso,
  ErrosCadastro,
  Rascunho,
  rascunhoEmBranco
} from './padrao.model';
import { validarRascunho } from './padrao.validacao';
import { PadraoService } from '../services/padrao.service';

/**
 * COMPONENTE DE REFERENCIA
 *
 * Este e o desenho que vale para qualquer formulario da disciplina.
 * Nao ha regra de validacao nenhuma aqui dentro: quem sabe validar e o
 * padrao.validacao.ts. A classe so guarda o estado e conversa com a tela.
 *
 * Quatro membros e o coracao de tudo:
 *
 *   rascunho  o que esta sendo digitado agora
 *   tocados   em quais campos a pessoa ja entrou e saiu
 *   erros     GETTER, recalculado a cada verificacao de tela
 *   salvar()  o que acontece quando o formulario e enviado
 */
@Component({
  selector: 'app-padrao',
  imports: [CommonModule, FormsModule],
  templateUrl: './padrao.html',
  styleUrl: './padrao.css'
})
export class Padrao implements OnInit {
  id: number | null = null;
  modo: 'criar' | 'editar' = 'criar';
  cadastrados: Cadastro[] = [];
  loading = false;
  saving = false;
  formularioDisponivel = true;
  erro = '';

  readonly titulo = 'Formulario padrao';

  /** exposto para o template montar o <select> sem repetir a lista */
  readonly cursos: Curso[] = CURSOS;

  rascunho: Rascunho = rascunhoEmBranco();

  tocados: CamposTocados = {};

  constructor(
    private service: PadraoService,
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

    this.carregarDados();
  }

  private carregarDados(): void {
    this.loading = true;
    this.service.listar().subscribe({
      next: (cadastrados) => {
        this.cadastrados = cadastrados;
        if (this.id === null) {
          this.loading = false;
          return;
        }
        this.service.buscarPorId(this.id).subscribe({
          next: (cadastro) => {
            const { id, ...dados } = cadastro;
            this.rascunho = { ...dados, senha: '', confirmarSenha: '' };
            this.loading = false;
          },
          error: () => {
            this.erro = 'Não foi possível carregar o cadastro para edição.';
            this.formularioDisponivel = false;
            this.loading = false;
          }
        });
      },
      error: () => {
        this.erro = 'Não foi possível carregar os cadastros.';
        if (this.id !== null) this.formularioDisponivel = false;
        this.loading = false;
      }
    });
  }

  /**
   * GETTER, e nao campo.
   * Campo e calculado uma vez, na construcao. Getter e recalculado toda
   * vez que alguem o le -- e quem le e o Angular, a cada verificacao.
   * E por isso que a mensagem acompanha a digitacao sem ninguem
   * chamar "revalidar".
   */
  get erros(): ErrosCadastro {
    return validarRascunho(
      this.rascunho,
      this.cadastrados.filter((cadastro) => cadastro.id !== this.id)
    );
  }

  get quantidadeDeErros(): number {
    return Object.keys(this.erros).filter((c) => this.tocados[c as CampoDoFormulario]).length;
  }

  get temErro(): boolean {
    return Object.keys(this.erros).length > 0;
  }

  /** So mostra a mensagem se a pessoa JA SAIU do campo. */
  deveMostrar(campo: CampoDoFormulario): boolean {
    return this.tocados[campo] === true && this.erros[campo] !== undefined;
  }

  mensagem(campo: CampoDoFormulario): string {
    return this.erros[campo] ?? '';
  }

  marcarTocado(campo: CampoDoFormulario): void {
    this.tocados[campo] = true;
  }

  /** Ao enviar, todo campo passa a ser "tocado": e o que um formulario faz. */
  mostrarTudo(): void {
    const campos = Object.keys(this.rascunho) as CampoDoFormulario[];
    for (const campo of campos) {
      this.tocados[campo] = true;
    }
  }

  salvar(): void {
    if (this.saving || this.loading || !this.formularioDisponivel) return;
    if (this.temErro) {
      this.mostrarTudo();
      return;
    }

    this.saving = true;
    this.erro = '';
    const { senha, confirmarSenha, ...dados } = this.rascunho;
    void senha;
    void confirmarSenha;

    const request = this.id === null
      ? this.service.criar(dados)
      : this.service.atualizar(this.id, dados);
    request.subscribe({
      next: () => this.router.navigate(['/padrao']),
      error: () => {
        this.erro = 'Não foi possível salvar o cadastro.';
        this.saving = false;
      }
    });
  }

  limpar(): void {
    this.rascunho = rascunhoEmBranco();
    this.tocados = {};
  }

  voltar(): void {
    this.router.navigate(['/padrao']);
  }
}
