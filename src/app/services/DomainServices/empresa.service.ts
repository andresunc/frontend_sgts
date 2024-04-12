import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from 'src/app/models/DomainModels/Empresa';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  urlBackend = new UrlBackend().getUrlBackend();
  newEmpresaUrl = this.urlBackend + '/empresa/create';

  constructor(private http: HttpClient) { }

  // Método para crear un nuevo servicio
  addEmpresa(addEmpresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.newEmpresaUrl, addEmpresa);
  }

}
