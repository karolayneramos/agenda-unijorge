import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cadastro } from '../../padrao/padrao.model';
import { PadraoService } from '../../services/padrao.service';

@Component({
  selector: 'app-padrao-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './padrao-lista.html',
  styleUrl: './padrao-lista.css'
})
export class PadraoLista implements OnInit {
  cadastrados: Cadastro[] = [];
  loading = false;
  erro = '';

  constructor(private service: PadraoService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.erro = '';
    this.service.listar().subscribe({
      next: (cadastrados) => {
        this.cadastrados = cadastrados;
        this.loading = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os cadastros.';
        this.loading = false;
      }
    });
  }

  excluir(cadastro: Cadastro) {
    if (!confirm(`Excluir o cadastro de ${cadastro.nome}?`)) return;

    this.erro = '';
    this.service.excluir(cadastro.id).subscribe({
      next: () => this.carregar(),
      error: () => {
        this.erro = 'Não foi possível excluir o cadastro.';
      }
    });
  }
}
