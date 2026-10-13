import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Evento } from '../../models/evento';

@Component({
  selector: 'app-cadastro-evento',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro-evento.html',
  styleUrl: './cadastro-evento.css'
})
export class CadastroEvento {
  proximoId = 1;

  evento: Omit<Evento, 'id'> = {
    titulo: '',
    data: '',
    local: '',
    emailResponsavel: '',
    vagas: null
  };

  eventoSalvo: Evento | null = null;

  salvar(): void {
    if (
      !this.evento.titulo.trim() ||
      !this.evento.data ||
      !this.evento.local ||
      !this.evento.emailResponsavel.trim() ||
      this.evento.vagas === null ||
      this.evento.vagas < 0
    ) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    this.eventoSalvo = {
      id: this.proximoId++,
      ...this.evento
    };

    console.log('Evento cadastrado:', this.eventoSalvo);

    alert('Evento cadastrado com sucesso!');

    this.evento = {
      titulo: '',
      data: '',
      local: '',
      emailResponsavel: '',
      vagas: null
    };
  }
}