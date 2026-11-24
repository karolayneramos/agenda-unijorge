import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpresaCadastro, EmpresaRascunho } from '../models/empresa';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  constructor(private http: HttpClient) {}

  listar(): Observable<EmpresaCadastro[]> {
    return this.http.get<EmpresaCadastro[]>(`${API}/empresas`);
  }

  buscarPorId(id: number): Observable<EmpresaCadastro> {
    return this.http.get<EmpresaCadastro>(`${API}/empresas/${id}`);
  }

  criar(empresa: EmpresaRascunho): Observable<EmpresaCadastro> {
    return this.http.post<EmpresaCadastro>(`${API}/empresas`, empresa);
  }

  atualizar(id: number, empresa: EmpresaRascunho): Observable<EmpresaCadastro> {
    return this.http.put<EmpresaCadastro>(`${API}/empresas/${id}`, { ...empresa, id });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/empresas/${id}`);
  }
}
