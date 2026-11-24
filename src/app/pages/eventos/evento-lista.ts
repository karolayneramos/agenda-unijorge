import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento';

@Component({
  selector: 'app-evento-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './evento-lista.html',
  styleUrl: './evento-lista.css'
})
export class EventoLista implements OnInit {
  eventos: Evento[] = [];
  loading = false;
  erro = '';

  constructor(private svc: EventoService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.erro = '';
    this.svc.listar().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.loading = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os eventos.';
        this.loading = false;
      }
    });
  }

  excluir(evento: Evento) {
    if (!confirm('Excluir evento?')) return;

    this.erro = '';
    this.svc.excluir(evento.id).subscribe({
      next: () => this.carregar(),
      error: () => {
        this.erro = 'Não foi possível excluir o evento e seus participantes.';
      }
    });
  }
}