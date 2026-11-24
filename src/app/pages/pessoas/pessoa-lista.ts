import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PessoaCadastro } from '../../pessoa/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';

@Component({
  selector: 'app-pessoa-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pessoa-lista.html',
  styleUrl: './pessoa-lista.css'
})
export class PessoaLista implements OnInit {
  pessoas: PessoaCadastro[] = [];
  loading = false;
  erro = '';

  constructor(private service: PessoaService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.erro = '';
    this.service.listar().subscribe({
      next: (pessoas) => {
        this.pessoas = pessoas;
        this.loading = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar as pessoas.';
        this.loading = false;
      }
    });
  }

  excluir(pessoa: PessoaCadastro) {
    if (!confirm(`Excluir o cadastro de ${pessoa.nomeCompleto}?`)) return;

    this.erro = '';
    this.service.excluir(pessoa.id).subscribe({
      next: () => this.carregar(),
      error: () => {
        this.erro = 'Não foi possível excluir a pessoa.';
      }
    });
  }
}
