import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';
import { Item } from 'src/app/models/DomainModels/Item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  urlBackend = new UrlBackend().getUrlBackend();
  getItemsNotDeleteUrl = this.urlBackend + '/item/getAllNotDeleted';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método GET para obtener los Item no eliminados
  getItemsNotDelete(): Observable<Item[]> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<Item[]>(this.getItemsNotDeleteUrl, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al cargar los ítems', error);
          return throwError(error);
        })
      );
  }
}
