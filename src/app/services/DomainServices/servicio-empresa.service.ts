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
  deleteServicioEmpresaUrl = this.urlBackend + '/servicioEmpresa/delete/';

  constructor(private http: HttpClient) { }

  // UpDate Servicio Empresa por Servicio ID
  public update(id: number, servicioEmpresa: ServicioEmpresa): Observable<ServicioEmpresa> {
    return this.http.put<ServicioEmpresa>(this.upDateServicioEmpresaUrl + id, servicioEmpresa);
  }

  // deleteLogico Servicio Empresa por Servicio ID
  public deleteLogico(id: number): Observable<void> {
    return this.http.delete<void>(this.deleteServicioEmpresaUrl + id);
  }
}
