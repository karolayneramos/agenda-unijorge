import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmpresaCadastro } from '../../models/empresa';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-empresa-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './empresa-lista.html',
  styleUrl: './empresa-lista.css'
})
export class EmpresaLista implements OnInit {
  empresas: EmpresaCadastro[] = [];
  loading = false;
  erro = '';

  constructor(private service: EmpresaService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.erro = '';
    this.service.listar().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
        this.loading = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar as empresas.';
        this.loading = false;
      }
    });
  }

  excluir(empresa: EmpresaCadastro) {
    if (!confirm(`Excluir a empresa ${empresa.nome}?`)) return;

    this.erro = '';
    this.service.excluir(empresa.id).subscribe({
      next: () => this.carregar(),
      error: () => {
        this.erro = 'Não foi possível excluir a empresa.';
      }
    });
  }
}
