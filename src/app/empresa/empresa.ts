import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaCadastro, EmpresaRascunho } from '../models/empresa';
import { EmpresaService } from '../services/empresa.service';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css'
})
export class Empresa implements OnInit {
  id: number | null = null;
  modo: 'criar' | 'editar' = 'criar';
  empresa: EmpresaRascunho = {
    nome: '',
    cnpj: '',
    logomarca: '',
    fundacao: '',
    descricao: ''
  };
  loading = false;
  saving = false;
  formularioDisponivel = true;
  erro = '';

  constructor(
    private service: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.id = Number(idParam);
    this.modo = 'editar';
    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.erro = 'A empresa informada é inválida.';
      this.formularioDisponivel = false;
      return;
    }

    this.loading = true;
    this.service.buscarPorId(this.id).subscribe({
      next: (empresa: EmpresaCadastro) => {
        const { id, ...dados } = empresa;
        this.empresa = dados;
        this.loading = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar a empresa para edição.';
        this.formularioDisponivel = false;
        this.loading = false;
      }
    });
  }

  resetarFormulario(): void {
    this.empresa = {
      nome: '',
      cnpj: '',
      logomarca: '',
      fundacao: '',
      descricao: ''
    };
  }

  salvar(): void {
    if (this.saving || this.loading || (this.modo === 'editar' && this.id === null)) return;

    this.saving = true;
    this.erro = '';
    const request = this.id === null
      ? this.service.criar(this.empresa)
      : this.service.atualizar(this.id, this.empresa);
    request.subscribe({
      next: () => this.router.navigate(['/empresas']),
      error: () => {
        this.erro = 'Não foi possível salvar a empresa.';
        this.saving = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/empresas']);
  }
}
