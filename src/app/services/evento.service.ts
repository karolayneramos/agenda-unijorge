import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Evento } from '../models/evento';
import { ParticipanteService } from './participante.service';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class EventoService {
  constructor(private http: HttpClient, private participantes: ParticipanteService) {}

  listar(): Observable<Evento[]> { return this.http.get<Evento[]>(`${API}/eventos`); }

  buscarPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${API}/eventos/${id}`);
  }

  criar(e: Omit<Evento, 'id'>): Observable<Evento> { return this.http.post<Evento>(`${API}/eventos`, e); }

  atualizar(id: number, e: Omit<Evento, 'id'>): Observable<Evento> {
    return this.http.put<Evento>(`${API}/eventos/${id}`, { ...e, id });
  }

  excluir(id: number): Observable<void> {
    return this.participantes.listarPorEvento(id).pipe(
      switchMap((participantes) =>
        participantes.length
          ? forkJoin(participantes.map((participante) => this.participantes.excluir(id, participante.id)))
          : of(null)
      ),
      switchMap(() => this.http.delete<void>(`${API}/eventos/${id}`))
    );
  }
}