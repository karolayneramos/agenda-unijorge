import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cadastro } from '../padrao/padrao.model';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class PadraoService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Cadastro[]> {
    return this.http.get<Cadastro[]>(`${API}/cadastros`);
  }

  buscarPorId(id: number): Observable<Cadastro> {
    return this.http.get<Cadastro>(`${API}/cadastros/${id}`);
  }

  criar(cadastro: Omit<Cadastro, 'id'>): Observable<Cadastro> {
    return this.http.post<Cadastro>(`${API}/cadastros`, cadastro);
  }

  atualizar(id: number, cadastro: Omit<Cadastro, 'id'>): Observable<Cadastro> {
    return this.http.put<Cadastro>(`${API}/cadastros/${id}`, { ...cadastro, id });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/cadastros/${id}`);
  }
}
