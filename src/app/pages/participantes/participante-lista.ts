import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { ParticipanteService } from '../../services/participante.service';
import { Evento } from '../../models/evento';
import { Participante } from '../../models/participante';

@Component({
  selector: 'app-participante-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './participante-lista.html',
  styleUrl: './participante-lista.css'
})
export class ParticipanteLista implements OnInit {
  eventoId = 0;
  evento: Evento | null = null;
  participantes: Participante[] = [];
  loading = false;
  erroEvento = '';
  erroParticipantes = '';

  constructor(
    private svc: ParticipanteService,
    private eventos: EventoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventoId = Number(this.route.snapshot.paramMap.get('eventoId'));
    if (!Number.isInteger(this.eventoId) || this.eventoId <= 0) {
      this.erroEvento = 'O evento informado é inválido.';
      return;
    }
    this.carregarEvento();
    this.carregar();
  }

  private carregarEvento() {
    this.eventos.buscarPorId(this.eventoId).subscribe({
      next: (evento) => {
        this.evento = evento;
      },
      error: () => {
        this.erroEvento = 'Não foi possível carregar os dados do evento.';
      }
    });
  }

  carregar() {
    this.loading = true;
    this.erroParticipantes = '';
    this.svc.listarPorEvento(this.eventoId).subscribe({
      next: (participantes) => {
        this.participantes = participantes.filter((p) => p.eventoId === this.eventoId);
        this.loading = false;
      },
      error: () => {
        this.erroParticipantes = 'Não foi possível carregar os participantes.';
        this.loading = false;
      }
    });
  }

  editar(p: Participante) { this.router.navigate(['/eventos', this.eventoId, 'participantes', p.id, 'editar']); }

  excluir(participante: Participante) {
    if (!confirm('Excluir participante?')) return;

    this.erroParticipantes = '';
    this.svc.buscarPorId(this.eventoId, participante.id).subscribe({
      next: (encontrado) => {
        if (encontrado.eventoId !== this.eventoId) {
          this.erroParticipantes = 'O participante não pertence a este evento.';
          return;
        }
        this.svc.excluir(this.eventoId, encontrado.id).subscribe({
          next: () => this.carregar(),
          error: () => {
            this.erroParticipantes = 'Não foi possível excluir o participante.';
          }
        });
      },
      error: () => {
        this.erroParticipantes = 'Não foi possível confirmar o vínculo do participante.';
      }
    });
  }
}