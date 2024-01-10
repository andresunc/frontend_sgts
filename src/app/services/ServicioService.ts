import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servicios } from '../models/Servicios';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  listServicio: Servicios[] = [];
  url = './assets/arrayServicios.json';
  
  constructor(private http: HttpClient) { }

  cargarDatosDesdeJSON() {
    this.http.get<Servicios[]>('./assets/arrayServicios.json').subscribe(
      (data: Servicios[]) => {
        this.listServicio = data;
      },
      (error) => {
        console.error('Error cargando datos desde el archivo JSON', error);
      }
    );
  }
}
