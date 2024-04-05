import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioEmpresa } from 'src/app/models/DomainModels/ServicioEmpresa';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class ServicioEmpresaService {

  urlBackend = new UrlBackend().getUrlBackend();
  upDateServicioEmpresaUrl = this.urlBackend + '/servicioEmpresa/update/';

  constructor(private http: HttpClient) { }

  // UpDate Servicio Empresa por Servicio ID
  public update(id: number, servicioEmpresa: ServicioEmpresa): Observable<ServicioEmpresa> {
    return this.http.put<any>(this.upDateServicioEmpresaUrl + id, servicioEmpresa);
  }
}
