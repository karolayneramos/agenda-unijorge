import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface EmpresaCadastro {
  nome: string;
  cnpj: string;
  logomarca: string;
  fundacao: string;
  descricao: string;
}

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css'
})
export class Empresa {
  empresa: EmpresaCadastro = {
    nome: '',
    cnpj: '',
    logomarca: '',
    fundacao: '',
    descricao: ''
  };

  empresaSalva: EmpresaCadastro | null = null;

  resetarFormulario(): void {
    this.empresa = {
      nome: '',
      cnpj: '',
      logomarca: '',
      fundacao: '',
      descricao: ''
    };
    this.empresaSalva = null;
  }

  salvar(): void {
    if (
      !this.empresa.nome.trim() ||
      !this.empresa.cnpj.trim() ||
      !this.empresa.logomarca.trim() ||
      !this.empresa.fundacao ||
      !this.empresa.descricao.trim()
    ) {
      alert('Preencha todos os campos da empresa antes de salvar.');
      return;
    }

    this.empresaSalva = { ...this.empresa };
    alert('Empresa cadastrada com sucesso!');

    this.empresa = {
      nome: '',
      cnpj: '',
      logomarca: '',
      fundacao: '',
      descricao: ''
    };
  }
}
